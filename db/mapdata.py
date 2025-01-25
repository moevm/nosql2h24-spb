import osmnx as ox
import neo4j

G = ox.graph_from_place("Санкт-Петербург", network_type="walk", simplify=False)
# fig, ax = ox.plot_graph(G)

gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
gdf_nodes.reset_index(inplace=True)
gdf_relationships.reset_index(inplace=True)

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = neo4j.GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Intersection) REQUIRE i.osmid IS UNIQUE"

rel_index_query = "CREATE INDEX IF NOT EXISTS FOR ()-[r:ROAD_SEGMENT]-() ON r.road_osmid"

point_index_query = "CREATE POINT INDEX IF NOT EXISTS FOR (i:Intersection) ON i.intersection_location"

node_query = '''    
    UNWIND $rows AS row
    WITH row WHERE row.osmid IS NOT NULL
    MERGE (i:Intersection {osmid: row.osmid})
        SET i.intersection_location = point({latitude: row.y, longitude: row.x }),
            i.street_count = toInteger(row.street_count)
    RETURN COUNT(*) as total
    '''

rels_query = '''
    UNWIND $rows AS road
    MATCH (u:Intersection {osmid: road.u})
    MATCH (v:Intersection {osmid: road.v})
    MERGE (u)-[r:ROAD_SEGMENT {road_osmid: road.osmid}]->(v)
        SET r.oneway = road.oneway,
            r.lanes = road.lanes,
            r.road_name = road.name,
            r.road_highway = road.highway,
            r.road_length = toFloat(road.length)        
    RETURN COUNT(*) AS total
    '''

driver.execute_query(constraint_query)
driver.execute_query(rel_index_query)
driver.execute_query(point_index_query)


nodes = gdf_nodes.loc[:, gdf_nodes.columns != 'geometry'].to_dict('records')

BATCH_SIZE = 2000

iter_num = len(nodes) // BATCH_SIZE + 1
for i in range(iter_num):
    print(i)
    l = BATCH_SIZE * i
    r = BATCH_SIZE * (i + 1)
    driver.execute_query(node_query, {'rows': nodes[l: r]})

del nodes

rels = gdf_relationships.loc[:, gdf_relationships.columns != 'geometry'].to_dict('records')
iter_num = len(rels) // BATCH_SIZE + 1
print(f'rels len:{len(rels)}')
for i in range(iter_num):
    print(i)
    l = BATCH_SIZE * i
    r = BATCH_SIZE * (i + 1)
    driver.execute_query(rels_query, {'rows': rels[l:r]})
