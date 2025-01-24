FROM neo4j:5.23.0

ENV NEO4J_AUTH=neo4j/password

COPY ./dumps /var/lib/neo4j/import

CMD ["neo4j"]