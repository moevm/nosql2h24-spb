import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateIntersectionDto} from "./dto/create-intersection.dto";
import {Neo4jService} from "../neo4j/neo4j.service";
import Intersection from "./entities/intersection.entity";


@Injectable()
export class IntersectionsService {

    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(dto: CreateIntersectionDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            // const result = await session.run(
            //     `WITH point({latitude: ${dto.location.latitude}, longitude: ${dto.location.longitude}}) AS l
            //     CALL (l) {        
            //         MATCH (i: Intersection WHERE point.distance(i.location, l) < ${(IntersectionsService.FIND_INTERSECTION_RADIUS)}) 
            //         RETURN i 
            //         ORDER BY point.distance(i.location, l) ASC 
            //         LIMIT 1
            //     } 
            //     WITH i, l
            //     CREATE (poi :Dot {
            //         name: "${dto.name}",
            //         description: "${dto.description}",
            //         location: l,
            //         created_at: Datetime()}
            //         )-[r: CLOSE_TO_THE]->(i)
            //     RETURN poi`);
            // const node = result.records.at(0).get('poi');
            // return new Dot(
            //     node.elementId,
            //     node.properties.name,
            //     node.properties.description,
            //     node.properties.location,
            //     node.properties.created_at.toString(),
            // );
        } finally {
            await session.close();
        }
    }

    async findAll() {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (intersection :Intersection) RETURN intersection`
            )
            return result.records.map(record => {
                const node = record.get('intersection');
                return new Intersection(
                    node.elementId,
                    node.properties.location,
                    node.properties.count_streets,
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
                `MATCH (intersection :Intersection WHERE elementId(intersection) = "${id}") RETURN intersection`
            )
            const node = result.records.at(0)?.get('intersection');
            if (!node) {
                throw new NotFoundException(`Intersection with id: ${id} not found`);
            }
            return new Intersection(
                node.elementId,
                node.properties.location,
                node.properties.count_streets,
            );
        } finally {
            await session.close();
        }
    }

}
