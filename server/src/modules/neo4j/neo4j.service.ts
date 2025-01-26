import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
import neo4j, { Driver, Session } from 'neo4j-driver';
import { Neo4jConfig } from "./neo4j-config.interface";

@Injectable()
export class Neo4jService implements OnApplicationShutdown, OnModuleInit {
    constructor(
        @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
        @Inject(NEO4J_DRIVER) private readonly driver: Driver,
    ) {
    }

    async onModuleInit() {
        const session = this.getWriteSession();
        try {
            await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (i:Intersection) REQUIRE i.osmid IS UNIQUE`);
            await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (user:User) REQUIRE user.email IS UNIQUE`);
            await session.run(`CREATE INDEX IF NOT EXISTS FOR ()-[r:ROAD_SEGMENT]-() ON r.road_osmid`);
            await session.run(`CREATE POINT INDEX IF NOT EXISTS FOR (i:Intersection) ON i.intersection_location`);
            await session.run(`CREATE INDEX IF NOT EXISTS FOR (i:Intersection) ON i._id`)
    
            const countNode: number = (await session.run(`MATCH (n) RETURN COUNT(n) AS countNode`)).records.at(0).get('countNode');
    
            if (countNode > 0) {
                console.log("DB contains nodes initialization skipped")
                return;
            }

            await session.run(`
                LOAD CSV WITH HEADERS FROM 'file:///users.csv' AS row
                WITH row WHERE row._labels = ":User"
                CALL (row) {
                    CREATE (u:User {
                        name: row.name,
                        email: row.email,
                        role: row.role,
                        created_at: datetime(row.created_at),
                        password: row.password
                    })
                } IN TRANSACTIONS
            `)

            await session.run(`
                LOAD CSV WITH HEADERS FROM "file:///intersections_roads.csv" AS row
                WITH row WHERE row._labels = ":Intersection"
                WITH apoc.convert.fromJsonMap(row.intersection_location) AS location, row
                CALL (row, location) {
                    CREATE (i :Intersection {osmid: toInteger(row.osmid)}) 
                    SET i.intersection_location = point({latitude: location.latitude, longitude: location.longitude}),
                        i.street_count = toInteger(row.street_count),
                        i._id = row._id
                } IN TRANSACTIONS`
            ); 
            await session.run(`
                LOAD CSV WITH HEADERS FROM "file:///intersections_roads.csv" as row
                WITH row WHERE row._type = "ROAD_SEGMENT"
                CALL (row) {
                    MATCH (u:Intersection {_id: row._start})
                    MATCH (v:Intersection {_id: row._end})   
                    MERGE (u)-[r:ROAD_SEGMENT {road_osmid: toInteger(row.road_osmid)}]->(v)
                    SET r.oneway = row.oneway,
                        r.lanes = row.lanes,
                        r.road_name = row.road_name,
                        r.road_length = toFloat(row.road_length)
                } IN TRANSACTIONS`
            );  
            await session.run(` MATCH (n:Intersection) REMOVE n._id;`)

            await session.run(`
                LOAD CSV WITH HEADERS FROM 'file:///points_of_interest.csv' AS row
                WITH apoc.convert.fromJsonMap(row.poi_location) AS l, row
                WITH point({latitude: l.latitude, longitude: l.longitude}) AS location, row
                CALL (location) {        
                    MATCH (i: Intersection WHERE point.distance(i.intersection_location, location) < 10000) 
                    RETURN i 
                    ORDER BY point.distance(i.intersection_location, location) ASC 
                    LIMIT 1
                } 
                WITH i, location, row
                CREATE (poi :PointOfInterest {
                    poi_name: row.poi_name,
                    poi_description: row.poi_description,
                    poi_location: location,
                    poi_images: row.poi_images,
                    poi_created_at: Datetime(row.poi_created_at)
                })-[r: CLOSE_TO_THE]->(i)
            `);

            await session.run(`
                LOAD CSV WITH HEADERS FROM 'file:///routes.csv' AS row
                WITH row, apoc.convert.fromJsonList(row.points) AS points
                UNWIND points AS point
                MATCH (user: User{email:row.author_email})
                MERGE (user)-[:CREATED]->(route :Route {route_name: row.name})
                SET  route.route_description= row.description,
                    route.route_created_at= row.created_at,
                    route.route_length= row.length,
                    route.route_duration= row.duration
                WITH route, collect(point({latitude: point.lat, longitude: point.lon})) AS points
                UNWIND points AS l
                OPTIONAL MATCH (poi :PointOfInterest WHERE poi.poi_location = l)
                WITH DISTINCT route, poi, RANGE(0, SIZE(points) - 1) AS order_list
                WITH collect(poi) AS points, order_list, route
                UNWIND apoc.coll.zip(points, order_list) AS poi
                WITH poi[0] AS val, poi[1] AS i, route
                MERGE (route)-[:INCLUDE{order: i}]->(val)
            `);
        } finally {
            session.close();
        }
    }

    getReadSession(): Session {
        return this.driver.session({
            database: this.config.database,
            defaultAccessMode: neo4j.session.READ,
        });
    }

    getWriteSession(): Session {
        return this.driver.session({
            database: this.config.database,
            defaultAccessMode: neo4j.session.WRITE,
        });
    }

    onApplicationShutdown() {
        return this.driver.close();
    }
}
