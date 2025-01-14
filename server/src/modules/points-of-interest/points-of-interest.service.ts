import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePointOfInterestDto } from "./dto/create-point-of-interest.dto";
import { Neo4jService } from "../neo4j/neo4j.service";
import PointOfInterest from "./entities/point-of-interest.entity";


@Injectable()
export class PointsOfInterestService {
    private static readonly FIND_INTERSECTION_RADIUS: number = 100000;

    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(dto: CreatePointOfInterestDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            const result = await session.run(
                `WITH point({latitude: ${dto.location.latitude}, longitude: ${dto.location.longitude}}) AS l
                CALL (l) {        
                    MATCH (i: Intersection WHERE point.distance(i.location, l) < ${(PointsOfInterestService.FIND_INTERSECTION_RADIUS)}) 
                    RETURN i 
                    ORDER BY point.distance(i.location, l) ASC 
                    LIMIT 1
                } 
                WITH i, l
                CREATE (poi :PointOfInterest {
                    name: "${dto.name}",
                    description: "${dto.description}",
                    location: l,
                    created_at: Datetime()}
                    )-[r: CLOSE_TO_THE]->(i)
                RETURN poi`
            );
            const node = result.records.at(0).get('poi');
            return new PointOfInterest(
                node.elementId,
                node.properties.name,
                node.properties.description,
                node.properties.location,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

    async findAll() {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (poi :PointOfInterest) RETURN poi`
            )
            return result.records.map(record => {
                const node = record.get('poi');
                return new PointOfInterest(
                    node.elementId,
                    node.properties.name,
                    node.properties.description,
                    node.properties.location,
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
                `MATCH (poi :PointOfInterest WHERE elementId(poi) = "${id}") RETURN poi`
            )
            const node = result.records.at(0)?.get('poi');
            if (!node) {
                throw new NotFoundException(`Point of interest with id: ${id} not found`);
            }
            return new PointOfInterest(
                node.elementId,
                node.properties.name,
                node.properties.description,
                node.properties.location,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

}
