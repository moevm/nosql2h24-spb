import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Neo4jErrorFilter} from "./modules/neo4j/neo4j-error.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new Neo4jErrorFilter())
    
    app.enableCors({
        origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
        optionsSuccessStatus: 204
    });
    await app.listen(8080);
}

bootstrap();
