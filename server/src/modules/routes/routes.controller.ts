import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Public } from '../authorization/public.decorator';
import { CreateRouteDto } from './dto/create-route.dto';

@Controller("/api/routes")
export class RoutesController {
    constructor(private readonly RoutesService: RoutesService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createRouteDto: CreateRouteDto, @Req() req: any) {
        console.log(req.user)
        return this.RoutesService.create(createRouteDto, req.user.sub);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("build")
    async build(@Body() poiList: string[]) {
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
