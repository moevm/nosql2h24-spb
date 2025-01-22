import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {IntersectionsService} from './intersections.service';
import {CreateIntersectionDto} from "./dto/create-intersection.dto";
import {Public} from "../authorization/public.decorator";

@Controller("/api/dot")
export class IntersectionsController {
    constructor(private readonly IntersectionsService: IntersectionsService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createDotDto: CreateIntersectionDto) {
        return await this.IntersectionsService.create(createDotDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.IntersectionsService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.IntersectionsService.findOne(id);
    }
}
