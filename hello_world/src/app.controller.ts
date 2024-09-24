import { Controller, Get } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('/read')
  async readFromDB() {}

  @Get('/write')
  async writeInDB() {}
}
