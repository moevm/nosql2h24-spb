import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppController} from './app.controller';
import {Neo4jModule} from './modules/neo4j/neo4j.module';
import {Neo4jConfig} from './modules/neo4j/neo4j-config.interface';
import {PointsOfInterestModule} from './modules/points-of-interest/points-of-interest.module';
import {UsersModule} from "./modules/users/users.module";
import {AuthorizationModule} from "./modules/authorization/authorization.module";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        Neo4jModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): Neo4jConfig => ({
                scheme: configService.get('NEO4J_SCHEME'),
                host: configService.get('NEO4J_HOST'),
                port: configService.get('NEO4J_PORT'),
                username: configService.get('NEO4J_USERNAME'),
                password: configService.get('NEO4J_PASSWORD'),
                database: configService.get('NEO4J_DB'),
            }),
        }),
        PointsOfInterestModule,
        UsersModule,
        AuthorizationModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
