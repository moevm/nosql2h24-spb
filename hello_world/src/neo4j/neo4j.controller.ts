import { Controller, Get, Post, Body } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';

@Controller('neo4j')
export class Neo4jController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('read')
  async readData() {
    const session = this.neo4jService.getReadSession();
    try {
      const result = await session.run('MATCH (n) RETURN n LIMIT 10');
      return result.records.map(record => record.get('n'));
    } finally {
      await session.close();
    }
  }

  @Post('write')
  async writeData(@Body() data: { name: string }) {
    const session = this.neo4jService.getWriteSession();
    try {
      const result = await session.run(
        'CREATE (n:Person {name: $name}) RETURN n',
        { name: data.name },
      );
      return result.records.map(record => record.get('n'));
    } finally {
      await session.close();
    }
  }
}
