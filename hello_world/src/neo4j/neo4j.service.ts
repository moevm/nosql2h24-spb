import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
import neo4j, { Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_CONFIG) private readonly config,
    @Inject(NEO4J_DRIVER) private readonly driver,
  ) {}

  getReadSession(): Session {
    return this.driver.session({
      database: this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(): Session {
    return this.driver.session({
      database: this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  onApplicationShutdown() {
    return this.driver.close();
  }
}
