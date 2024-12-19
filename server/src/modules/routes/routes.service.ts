import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateRouteDto} from "./dto/create-route.dto";
import {Neo4jService} from "../neo4j/neo4j.service";
import Route from "./entities/routes.entity";


@Injectable()
export class RoutesService {
    // private static readonly FIND_INTERSECTION_RADIUS: number = 100000;

    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(dto: CreateRouteDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            // const result = await session.run(
            //     `WITH point({latitude: ${dto.location.latitude}, longitude: ${dto.location.longitude}}) AS l
            //     CALL (l) {        
            //         MATCH (i: Intersection WHERE point.distance(i.location, l) < ${(PointsOfInterestService.FIND_INTERSECTION_RADIUS)}) 
            //         RETURN i 
            //         ORDER BY point.distance(i.location, l) ASC 
            //         LIMIT 1
            //     } 
            //     WITH i, l
            //     CREATE (poi :Route {
            //         name: "${dto.name}",
            //         description: "${dto.description}",
            //         location: l,
            //         created_at: Datetime()}
            //         )-[r: CLOSE_TO_THE]->(i)
            //     RETURN poi`);
            // const node = result.records.at(0).get('poi');
            // return new Route(
            //     node.elementId,
            //     node.properties.name,
            //     node.properties.description,
            //     node.properties.length,
            //     node.properties.duration,
            //     node.properties.created_at.toString()
            // );
        } finally {
            await session.close();
        }
    }

    async findAll() {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (route :Route) RETURN route`
            )
            return result.records.map(record => {
                const node = record.get('route');
                return new Route(
                    node.elementId,
                    node.properties.name,
                    node.properties.description,
                    node.properties.length,
                    node.properties.duration,
                    node.properties.created_at.toString()
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
                `MATCH (route :Route WHERE elementId(route) = "${id}") RETURN route`
            )
            const node = result.records.at(0)?.get('route');
            if (!node) {
                throw new NotFoundException(`Route with id: ${id} not found`);
            }
            return new Route(
                node.elementId,
                node.properties.name,
                node.properties.description,
                node.properties.length,
                node.properties.duration,
                node.properties.created_at.toString()
            );
        } finally {
            await session.close();
        }
    }

}
