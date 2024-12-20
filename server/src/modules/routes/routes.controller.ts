import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {RoutesService} from './routes.service';
import {CreateRouteDto} from "./dto/create-route.dto";
import {Public} from "../authorization/public.decorator";

@Controller("/api/route")
export class RoutesController {
    constructor(private readonly RoutesService: RoutesService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createRoutesDto: CreateRouteDto) {
        return await this.RoutesService.create(createRoutesDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.RoutesService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.RoutesService.findOne(id);
    }
}
