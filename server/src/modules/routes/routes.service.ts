import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../neo4j/neo4j.service";
import Route from "./entities/route.entity";
import { CreateRouteDto } from "./dto/create-route.dto";
import PointOfInterest from "../points-of-interest/entities/point-of-interest.entity";
import { User } from "../users/entities/user.entity";
import { RoutesFilterDto } from "./dto/routes-filter.dto";


@Injectable()
export class RoutesService {
    constructor(private readonly neo4jService: Neo4jService) {
    }


    async create(dto: CreateRouteDto, userId: string) {
        const session = this.neo4jService.getWriteSession();
        try {
            const transaction = session.beginTransaction();
            const result = await transaction.run(`
                MATCH (user: User WHERE elementId(user) = "${userId}")
                CREATE (user)-[:CREATED]->(route :Route {
                    route_name: "${dto.name}", 
                    route_description: "${dto.description}", 
                    route_created_at: Datetime()
                }) 
                WITH route, $poi_list AS points
                UNWIND points AS point
                OPTIONAL MATCH (poi :PointOfInterest WHERE elementId(poi)=point)
                WITH route, poi, 
                    CASE WHEN poi IS NULL THEN TRUE ELSE FALSE END AS node_not_found, 
                    RANGE(0, SIZE(points) - 1) AS order_list, point
                CALL apoc.util.validate(node_not_found,'Point of interest with id ' + point + ' not found', [404])
                WITH collect(poi) AS points, order_list, route
                UNWIND apoc.coll.zip(points, order_list) AS poi
                WITH poi[0] AS val, poi[1] AS i, route
                CREATE (route)-[:INCLUDE{order: i}]->(val)
                RETURN elementId(route) AS Id
                LIMIT 1
                `,
                { poi_list: dto.points }
            );
            const routeId = result.records.at(0)?.get('Id');
            if (!routeId) {
                throw new NotFoundException(`User with id ${userId} not found`)
            }
            transaction.run(`
                MATCH (route: Route WHERE elementId(route) = $routeId)
                CALL () {
                    MATCH 
                    (route)-[inc1: INCLUDE]->
                    (:PointOfInterest)-[:CLOSE_TO_THE]->(i1: Intersection),
                    (route)-[inc2: INCLUDE{order: inc1.order + 1}]->
                    (:PointOfInterest)-[:CLOSE_TO_THE]->(i2: Intersection)
                    RETURN i1, i2
                    ORDER BY inc1.order
                }
                WITH DISTINCT route, i1, i2
                CALL apoc.algo.aStarConfig(i1, i2, "ROAD_SEGMENT", {
                    pointPropName: "intersection_location", 
                    weight: "road_length"
                })  
                YIELD weight
                WITH SUM(weight) as total_distance, route
                SET route.route_length = total_distance
                SET route.route_duration = total_distance / 78
                RETURN route
                `,
                { routeId: routeId }
            );
            await transaction.commit();
            return await this.findOne(routeId);
        } finally {
            await session.close();
        }
    }


    async build(poiList: string[]) {
        const session = this.neo4jService.getWriteSession();
        try {
            const result = await session.run(
                `CALL () { 
                    UNWIND $poi_list AS poi_id 
                    MATCH(poi :PointOfInterest WHERE elementId(poi) = poi_id)-[:CLOSE_TO_THE]->(i :Intersection) 
                    RETURN collect(DISTINCT i) AS i_list
                }
                WITH i_list[0..-1] AS i1, i_list[1..] AS i2
                UNWIND apoc.coll.zip(i1, i2) AS segment
                CALL apoc.algo.aStarConfig(segment[0], segment[1], "ROAD_SEGMENT", {
                    pointPropName: "intersection_location",
                    weight: "road_length"
                })
                YIELD weight, path
                RETURN weight AS length, path`,
                { poi_list: poiList }
            );
            return result.records.map(record => record.toObject());
        } finally {
            await session.close();
        }
    }

    async findAll(filters?: RoutesFilterDto) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(`
                MATCH (user:User 
                    WHERE user.name =~ '.*(?ui)${filters?.author ?? ''}.*' OR elementId(user) = '${filters?.author ?? ''}'
                )-[:CREATED]->(route:Route WHERE route.route_name =~ '.*(?ui)${filters?.search ?? ''}.*' 
                    AND datetime(route.route_created_at) >= datetime('${filters?.minDate ?? '1970-01-01T00:00:00Z'}')
                    AND datetime(route.route_created_at) <= datetime('${filters?.maxDate ?? '9999-12-31T23:59:59Z'}')
                    AND route.route_length >= ${filters?.minLength ?? 0}
                    AND route.route_length <= ${filters?.maxLength ?? Number.MAX_SAFE_INTEGER}
                    AND route.route_duration >= ${filters?.minDuration ?? 0}
                    AND route.route_duration <= ${filters?.maxDuration ?? Number.MAX_SAFE_INTEGER}
                )
                CALL (route) {
                    MATCH (route)-[inc:INCLUDE]->(poi :PointOfInterest)
                    RETURN poi
                    ORDER BY inc.order
                }
                WITH route, user, collect(elementId(poi)) AS poi_id_list, collect(poi) AS poi_list WHERE size(poi_list) >= ${filters?.minPoiCount ?? 2} 
                    AND size(poi_list) <= ${filters?.maxPoiCount ?? Number.MAX_SAFE_INTEGER} 
                    AND apoc.coll.containsAll(poi_id_list, $required_points) 

                RETURN route, user, poi_list`,
                { required_points: filters?.points ?? []}
            )
            return result.records.map(record => {
                const node = record.get('route');

                const poiList: PointOfInterest[] = record.get('poi_list').map(poi => new PointOfInterest(
                    poi.elementId,
                    poi.properties.poi_name,
                    poi.properties.poi_description,
                    poi.properties.poi_images,
                    poi.properties.poi_location,
                    poi.properties.poi_created_at.toString(),
                ));
                const userNode = record.get('user');
                const user = new User(
                    userNode.elementId,
                    userNode.properties.name,
                    userNode.properties.email,
                    undefined,
                    userNode.properties.role,
                    userNode.properties.created_at.toString()
                );
                return new Route(
                    node.elementId,
                    node.properties.route_name,
                    node.properties.route_description,
                    node.properties.route_length,
                    node.properties.route_duration,
                    node.properties.route_created_at.toString(),
                    poiList,
                    user
                );
            });
        } finally {
            await session.close();
        }
    }

    async findAllFiltr(filtr: any) {
        const session = this.neo4jService.getReadSession();
        try {
            const queryParams: any = {};
            const conditions: string[] = [];

            if (filtr.name) {
                conditions.push('LOWER(route.route_name) =~ LOWER($name)');
                queryParams.name = `(?i).*${filtr.name.toLowerCase()}.*`;
            }
            if (filtr.description) {
                conditions.push('LOWER(route.route_description) =~ LOWER($description)');
                queryParams.description = `(?i).*${filtr.description.toLowerCase()}.*`;
            }
            if (filtr.fromDate) {
                conditions.push('route.route_created_at >= datetime($fromDate)');
                queryParams.fromDate = filtr.fromDate;
            }
            if (filtr.toDate) {
                conditions.push('route.route_created_at <= datetime($toDate)');
                queryParams.toDate = filtr.toDate;
            }
            if (filtr.fromDuration) {
                conditions.push('route.route_duration >= $fromDuration');
                queryParams.fromDuration = filtr.fromDuration;
            }
            if (filtr.toDuration) {
                conditions.push('route.route_duration <= $toDuration');
                queryParams.toDuration = filtr.toDuration;
            }
            if (filtr.fromLength) {
                conditions.push('route.route_length >= $fromLength');
                queryParams.fromLength = filtr.fromLength;
            }
            if (filtr.toLength) {
                conditions.push('route.route_length <= $toLength');
                queryParams.toLength = filtr.toLength;
            }
            if (filtr.author) {
                conditions.push('LOWER(user.name) =~ LOWER($author)');
                queryParams.author = `(?i).*${filtr.author.toLowerCase()}.*`;
            }
            if (filtr.points) {
                conditions.push(`
                    ALL(d IN $points 
                        WHERE EXISTS { 
                            MATCH (route)-[:INCLUDE]->(poi:PointOfInterest) 
                            WHERE elementId(poi) = d 
                        }
                    )
                `);
                queryParams.points = filtr.points;
            }

            let query = `
                MATCH (user:User)-[:CREATED]->(route:Route)
            `;

            if (conditions.length > 0) {
                query += '\nWHERE ' + conditions.join('\nAND ');
            }

            query += `
                \nCALL (route) {
                    MATCH (route)-[inc :INCLUDE]->(poi :PointOfInterest)
                    RETURN poi
                    ORDER BY inc.order
                }
            `

            query += '\nRETURN route, user, collect(poi) AS poi_list';

            const result = await session.run(query, queryParams);
            return result.records.map(record => {
                const node = record.get('route');

                const poiList: PointOfInterest[] = record.get('poi_list').map(poi => new PointOfInterest(
                    poi.elementId,
                    poi.properties.poi_name,
                    poi.properties.poi_description,
                    poi.properties.poi_images,
                    poi.properties.poi_location,
                    poi.properties.poi_created_at.toString(),
                ));
                const userNode = record.get('user');
                const user = new User(
                    userNode.elementId,
                    userNode.properties.name,
                    userNode.properties.email,
                    undefined,
                    userNode.properties.role,
                    userNode.properties.created_at.toString()
                );
                return new Route(
                    node.elementId,
                    node.properties.route_name,
                    node.properties.route_description,
                    node.properties.route_length,
                    node.properties.route_duration,
                    node.properties.route_created_at.toString(),
                    poiList,
                    user
                );
            });
        }
        finally {
            await session.close();
        }
    }

    async findOne(id: string) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `
                MATCH (user)-[:CREATED]->(route :Route WHERE elementId(route) = "${id}") 
                CALL (route) {
                    MATCH (route)-[inc :INCLUDE]->(poi :PointOfInterest)
                    RETURN poi
                    ORDER BY inc.order
                }
                RETURN route, user, collect(poi) AS poi_list
                `
            )
            const node = result.records.at(0)?.get('route');
            if (!node) {
                throw new NotFoundException(`Route with id: ${id} not found`);
            }
            const userNode = result.records.at(0)?.get('user');
            const user = new User(
                userNode.elementId,
                userNode.properties.name,
                userNode.properties.email,
                userNode.properties.password,
                userNode.properties.role,
                userNode.properties.created_at.toString()
            );
            const poiList: PointOfInterest[] = result.records.at(0)?.get('poi_list').map(poi => new PointOfInterest(
                poi.elementId,
                poi.properties.poi_name,
                poi.properties.poi_description,
                poi.properties.poi_images,
                poi.properties.poi_location,
                poi.properties.poi_created_at.toString(),
            ));
            return new Route(
                node.elementId,
                node.properties.route_name,
                node.properties.route_description,
                node.properties.route_length,
                node.properties.route_duration,
                node.properties.route_created_at.toString(),
                poiList,
                user
            );
        } finally {
            await session.close();
        }
    }

    async delete(id: string, userId: string) {
        const session = this.neo4jService.getWriteSession();
        try {
            await session.run(`
                MATCH (user: User WHERE elementId(user) = $userId), 
                (author: User)-[:CREATED]->(route :Route WHERE elementId(route) = $routeId) 
                DETACH DELETE CASE elementId(user) = elementId(author) OR user.role = 'ADMIN' WHEN true THEN route END
                `,
                { routeId: id, userId: userId }
            );
        } finally {
            await session.close();
        }
    }
}
