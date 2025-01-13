import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../neo4j/neo4j.service";
import Route from "./entities/route.entity";
import { CreateRouteDto } from "./dto/create-route.dto";
import PointOfInterest from "../points-of-interest/entities/point-of-interest.entity";


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
                    name: "${dto.name}", 
                    description: "${dto.description}", 
                    created_at: Datetime()
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
                CALL apoc.algo.aStarConfig(i1, i2, "ROAD_SEGMENT", {pointPropName: "location", weight: "length"})  
                YIELD weight
                WITH SUM(weight) as total_distance, route
                SET route.length = total_distance
                SET route.duration = total_distance / 78
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
                CALL apoc.algo.aStarConfig(segment[0], segment[1], "ROAD_SEGMENT", {pointPropName: "location", weight: "length"})
                YIELD weight, path
                RETURN weight AS length, path`,
                { poi_list: poiList }
            );
            return result.records.map(record => record.toObject());
        } finally {
            await session.close();
        }
    }

    async findAll() {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(`
                MATCH (route :Route) 
                CALL (route) {
                    MATCH (route)-[inc :INCLUDE]->(poi :PointOfInterest)
                    RETURN poi
                    ORDER BY inc.order
                }
                RETURN route, collect(poi) AS poi_list
                `
            )
            return result.records.map(record => {
                const node = record.get('route');
                const poiList: PointOfInterest[] = record.get('poi_list').map(poi => new PointOfInterest(
                    poi.elementId,
                    poi.properties.name,
                    poi.properties.description,
                    poi.properties.location,
                    poi.properties.created_at.toString(),
                ));
                return new Route(
                    node.elementId,
                    node.properties.name,
                    node.properties.description,
                    node.properties.length,
                    node.properties.duration,
                    node.properties.created_at.toString(),
                    poiList
                );
            });
        } finally {
            await session.close();
        }
    }

    async findOne(id: string) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `
                MATCH (route :Route WHERE elementId(route) = "${id}") 
                CALL (route) {
                    MATCH (route)-[inc :INCLUDE]->(poi :PointOfInterest)
                    RETURN poi
                    ORDER BY inc.order
                }
                RETURN route, collect(poi) AS poi_list
                `
            )
            const node = result.records.at(0)?.get('route');
            const poiList: PointOfInterest[] = result.records.at(0)?.get('poi_list').map(poi => new PointOfInterest(
                poi.elementId,
                poi.properties.name,
                poi.properties.description,
                poi.properties.location,
                poi.properties.created_at.toString(),
            ));
            if (!node) {
                throw new NotFoundException(`Route with id: ${id} not found`);
            }
            return new Route(
                node.elementId,
                node.properties.name,
                node.properties.description,
                node.properties.length,
                node.properties.duration,
                node.properties.created_at.toString(),
                poiList
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
