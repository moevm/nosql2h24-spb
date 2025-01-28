import { Controller, Get } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';

@Controller("/api/database")
export class Neo4jController {
    constructor(private readonly neo4jService: Neo4jService) {
    }

    @Get('/export')
    async exportData() {
        return this.neo4jService.exportData();
    }

}
