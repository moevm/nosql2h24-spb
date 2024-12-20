import osmnx as ox
import neo4j

G = ox.graph_from_place("Аптекарский остров", network_type="walk", simplify=False)
# fig, ax = ox.plot_graph(G)

gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
gdf_nodes.reset_index(inplace=True)
gdf_relationships.reset_index(inplace=True)

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = neo4j.GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Intersection) REQUIRE i.osmid IS UNIQUE"

rel_index_query = "CREATE INDEX IF NOT EXISTS FOR ()-[r:ROAD_SEGMENT]-() ON r.osmids"

point_index_query = "CREATE POINT INDEX IF NOT EXISTS FOR (i:Intersection) ON i.location"

node_query = '''
    UNWIND $rows AS row
    WITH row WHERE row.osmid IS NOT NULL
    MERGE (i:Intersection {osmid: row.osmid})
        SET i.location = point({latitude: row.y, longitude: row.x }),
            i.highway = row.highway,
            i.street_count = toInteger(row.street_count)
    RETURN COUNT(*) as total
    '''

rels_query = '''
    UNWIND $rows AS road
    MATCH (u:Intersection {osmid: road.u})
    MATCH (v:Intersection {osmid: road.v})
    MERGE (u)-[r:ROAD_SEGMENT {osmid: road.osmid}]->(v)
        SET r.oneway = road.oneway,
            r.lanes = road.lanes,
            r.name = road.name,
            r.highway = road.highway,
            r.length = toFloat(road.length)
    RETURN COUNT(*) AS total
    '''

driver.execute_query(constraint_query)
driver.execute_query(rel_index_query)
driver.execute_query(point_index_query)

driver.execute_query(node_query, {'rows': gdf_nodes.loc[:, gdf_nodes.columns != 'geometry'].to_dict('records')})
driver.execute_query(rels_query, {'rows': gdf_relationships.loc[:, gdf_relationships.columns != 'geometry'].to_dict('records')})