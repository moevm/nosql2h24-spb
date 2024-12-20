import {Body, Post, ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors} from '@nestjs/common';
import {UsersService} from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    // @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
