import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Public } from '../authorization/public.decorator';

@Controller("/api/routes")
export class RoutesController {
    constructor(private readonly RoutesService: RoutesService) {
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("build")
    async build(@Body() poiList: number[]) {
        return await this.RoutesService.build(poiList);
    }

    @Get()
    async findAll() {
        return this.RoutesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.RoutesService.findOne(id);
    }
}
