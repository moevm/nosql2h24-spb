import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {DotsService} from './dots.service';
import {CreateDotDto} from "./dto/create-dot.dto";
import {Public} from "../authorization/public.decorator";

@Controller("/api/dot")
export class DotsController {
    constructor(private readonly DotsService: DotsService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createDotDto: CreateDotDto) {
        return await this.DotsService.create(createDotDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.DotsService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.DotsService.findOne(id);
    }
}
