import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateWalkDto} from "./dto/create-walk.dto";
import {Neo4jService} from "../neo4j/neo4j.service";
import Walk from "./entities/walks.entity";


@Injectable()
export class WalksService {
    // private static readonly FIND_INTERSECTION_RADIUS: number = 100000;

    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(dto: CreateWalkDto) {
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
                `MATCH (walk :Walk) RETURN walk`
            )
            return result.records.map(record => {
                const node = record.get('walk');
                return new Walk(
                    node.properties.start_time.toString(),
                    node.properties.end_time.toString(),
                    node.elementId,
                    node.properties.length,
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
                `MATCH (walk :Walk WHERE elementId(walk) = "${id}") RETURN walk`
            )
            const node = result.records.at(0)?.get('rwalk');
            if (!node) {
                throw new NotFoundException(`Walk with id: ${id} not found`);
            }
            return result.records.map(record => {
                const node = record.get('walk');
                return new Walk(
                    node.properties.start_time.toString(),
                    node.properties.end_time.toString(),
                    node.elementId,
                    node.properties.length,
                );
            });
        } finally {
            await session.close();
        }
    }

}
