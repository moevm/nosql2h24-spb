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
                    poi_name: "${dto.name}",
                    poi_description: "${dto.description}",
                    poi_location: l,
                    poi_created_at: Datetime()}
                    )-[r: CLOSE_TO_THE]->(i)
                RETURN poi`
            );
            const node = result.records.at(0).get('poi');
            return new PointOfInterest(
                node.elementId,
                node.properties.name,
                node.properties.description,
                node.properties.images,
                node.properties.location,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

    async findAll(query?: string) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (poi :PointOfInterest) 
                WHERE poi.poi_name =~ '.*(?ui)${query ?? ''}.*'
                RETURN poi`
            );

            return result.records.map(record => {
                const node = record.get('poi');
                return new PointOfInterest(
                    node.elementId,
                    node.properties.poi_name,
                    node.properties.poi_description,
                    node.properties.poi_images,
                    node.properties.poi_location,
                    node.properties.poi_created_at.toString()
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
                conditions.push('LOWER(poi.poi_name) =~ LOWER($name)');
                queryParams.name = `(?i).*${filtr.name.toLowerCase()}.*`;
            }

            if (filtr.description) {
                conditions.push('ANY(d IN poi.poi_description WHERE LOWER(d) =~ LOWER($description))');
                queryParams.description = `(?i).*${filtr.description.toLowerCase()}.*`;
            }

            if (filtr.fromDate) {
                conditions.push('poi.poi_created_at >= datetime($fromDate)');
                queryParams.fromDate = filtr.fromDate;
            }

            if (filtr.toDate) {
                conditions.push('poi.poi_created_at <= datetime($toDate)');
                queryParams.toDate = filtr.toDate;
            }

            if (filtr.fromLat) {
                conditions.push('poi.poi_location.latitude >= $fromLat');
                queryParams.fromLat = parseFloat(filtr.fromLat);
            }

            if (filtr.fromLng) {
                conditions.push('poi.poi_location.longitude >= $fromLng');
                queryParams.fromLng = parseFloat(filtr.fromLng);
            }

            if (filtr.toLat) {
                conditions.push('poi.poi_location.latitude <= $toLat');
                queryParams.toLat = parseFloat(filtr.toLat);
            }

            if (filtr.toLng) {
                conditions.push('poi.poi_location.longitude <= $toLng');
                queryParams.toLng = parseFloat(filtr.toLng);
            }

            let query = 'MATCH (poi:PointOfInterest)';

            if (conditions.length > 0) {
                query += '\nWHERE ' + conditions.join('\nAND ');
            }

            query += '\nRETURN poi';

            const result = await session.run(query, queryParams);

            return result.records.map(record => {
                const node = record.get('poi');
                return new PointOfInterest(
                    node.elementId,
                    node.properties.poi_name,
                    node.properties.poi_description,
                    node.properties.poi_images,
                    node.properties.poi_location,
                    node.properties.poi_created_at.toString()
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
                node.properties.poi_name,
                node.properties.poi_description,
                node.properties.poi_images,
                node.properties.poi_location,
                node.properties.poi_created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

}
