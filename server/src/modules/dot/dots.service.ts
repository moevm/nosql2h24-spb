import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateDotDto} from "./dto/create-dot.dto";
import {Neo4jService} from "../neo4j/neo4j.service";
import Dot from "./entities/dot.entity";


@Injectable()
export class DotsService {

    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(dto: CreateDotDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            // const result = await session.run(
            //     `WITH point({latitude: ${dto.location.latitude}, longitude: ${dto.location.longitude}}) AS l
            //     CALL (l) {        
            //         MATCH (i: Intersection WHERE point.distance(i.location, l) < ${(DotsService.FIND_INTERSECTION_RADIUS)}) 
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
                `MATCH (dot :Dot) RETURN dot`
            )
            return result.records.map(record => {
                const node = record.get('dot');
                return new Dot(
                    node.elementId,
                    node.properties.location,
                    node.properties.time.toString()
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
                `MATCH (dot :Dot WHERE elementId(dot) = "${id}") RETURN dot`
            )
            const node = result.records.at(0)?.get('dot');
            if (!node) {
                throw new NotFoundException(`Dot with id: ${id} not found`);
            }
            return new Dot(
                node.elementId,
                node.properties.location,
                node.properties.time.toString(),
            );
        } finally {
            await session.close();
        }
    }

}
