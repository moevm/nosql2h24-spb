import json
import neo4j

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = neo4j.GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


def convert_json(json):
    description = []
    for text_block in list(filter(lambda obj: obj['type'] == 'text', json["main_info"])):
        description.extend(text_block["data"])

    images = [json["main_photo"]]
    for image_urls in list(filter(lambda obj: obj['type'] == 'img', json["main_info"])):
        images.extend(image_urls["data"])
    images = images[:5]

    return {
        "name": json["name"],
        "lat": float(json["coordinates"]["lat"]),
        "lon": float(json["coordinates"]["lon"]),
        "description": description,
        "images" : images
    }


query = '''
     UNWIND $rows AS row
     WITH point({latitude: row.lat, longitude: row.lon}) AS l, row
     CALL (l) {        
        MATCH (i: Intersection WHERE point.distance(i.location, l) < $radius) 
        RETURN i 
        ORDER BY point.distance(i.location, l) ASC 
        LIMIT 1
    } 
    WITH i, l, row
     CREATE (poi :PointOfInterest {
        name: row.name,
        description: row.description,
        location: l,
        images: row.images,
        created_at: Datetime()
    })-[r: CLOSE_TO_THE]->(i)
'''

with open('data.json') as f:
    json_data = list(map(convert_json, json.load(f)))
    driver.execute_query(query, {'rows': json_data, 'radius' : 10000})

