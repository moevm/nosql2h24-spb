import {ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors} from '@nestjs/common';
import {UsersService} from './users.service';

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
