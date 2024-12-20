import osmnx as ox

G = ox.graph_from_place("Аптекарский остров", network_type="walk", simplify=False)
# fig, ax = ox.plot_graph(G)

gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
gdf_nodes.reset_index(inplace=True)
gdf_relationships.reset_index(inplace=True)