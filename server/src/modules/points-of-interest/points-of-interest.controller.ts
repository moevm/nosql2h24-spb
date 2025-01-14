import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PointsOfInterestService } from './points-of-interest.service';
import { CreatePointOfInterestDto } from "./dto/create-point-of-interest.dto";
import { Public } from "../authorization/public.decorator";

@Controller("/api/poi")
export class PointsOfInterestController {
    constructor(private readonly pointsOfInterestService: PointsOfInterestService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createPointsOfInterestDto: CreatePointOfInterestDto) {
        return await this.pointsOfInterestService.create(createPointsOfInterestDto);
    }

    @Public()
    @Get()
    async findAll() {
        return this.pointsOfInterestService.findAll();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.pointsOfInterestService.findOne(id);
    }
}
