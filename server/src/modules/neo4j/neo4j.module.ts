import {DynamicModule, Module, Provider} from '@nestjs/common';
import {Neo4jService} from './neo4j.service';
import {createDriver} from './neo4j.util';
import {Neo4jConfig} from './neo4j-config.interface';
import {NEO4J_CONFIG, NEO4J_DRIVER} from './neo4j.constants';
import {ConfigModule} from '@nestjs/config';
import { Neo4jController } from './neo4j-controller';

@Module({})
export class Neo4jModule {
  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ConfigModule],
      controllers: [Neo4jController],

      providers: [
        {
          provide: NEO4J_CONFIG,
          ...configProvider,
        } as Provider,
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}