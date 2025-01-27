import {Body, Post, ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors, ValidationPipe, UsePipes, Req, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import {UsersService} from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req) {
        if (id != req.user.sub && req.user.role != 'ADMIN') {
            throw new ForbiddenException();
        }
        return this.usersService.findOne(id);
    }
}
