import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { Neo4jModule } from './modules/neo4j/neo4j.module';
import { Neo4jConfig } from './modules/neo4j/neo4j-config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME') ?? "neo4j",
        host: configService.get('NEO4J_HOST') ?? "localhost",
        port: configService.get('NEO4J_PORT') ?? 7687,
        username: configService.get('NEO4J_USERNAME') ?? "neo4j",
        password: configService.get('NEO4J_PASSWORD') ?? "password",
        database: configService.get('NEO4J_DB') ?? "neo4j",
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
