import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Neo4jErrorFilter} from "./modules/neo4j/neo4j-error.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new Neo4jErrorFilter())
    await app.listen(8080);
}

bootstrap();
