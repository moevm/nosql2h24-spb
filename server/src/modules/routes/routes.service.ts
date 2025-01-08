import {Injectable, NotFoundException} from "@nestjs/common";
import {Neo4jService} from "../neo4j/neo4j.service";
import Route from "./entities/route.entity";


@Injectable()
export class RoutesService {
    constructor(private readonly neo4jService: Neo4jService) {
    }

    async build(poiList: number[]) {
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
                {poi_list: poiList}
            );
            return result.records.map(record => record.toObject());
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
