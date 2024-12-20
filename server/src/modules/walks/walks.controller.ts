import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {WalksService} from './walks.service';
import {CreateWalkDto} from "./dto/create-walk.dto";
import {Public} from "../authorization/public.decorator";

@Controller("/api/walk")
export class WalksController {
    constructor(private readonly WalksService: WalksService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createWalkDto: CreateWalkDto) {
        return await this.WalksService.create(createWalkDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.WalksService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.WalksService.findOne(id);
    }
}
