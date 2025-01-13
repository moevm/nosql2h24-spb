import {
    Get,
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    SerializeOptions, UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
// import {Public} from "./public.decorator";
import { ShowDbEntriesService } from './show-db-entries.service';

// @Public()
@Controller('/api/show')
export class ShowDbEntriesController {
    constructor(private readonly showDbEntriesService: ShowDbEntriesService) {
    }

    @Get(path: '/data-base')
    async getShowInfo() {
        return this.showDbEntriesService.getAllDataBase();
    }

    // @HttpCode(HttpStatus.OK)
    // @UsePipes(new ValidationPipe())
    // @Post('/signIn')
    // async signIn(@Body() signInDto: SignInDto) {
    //     return this.authorizationService.signIn(signInDto);
    // }


    // @UsePipes(new ValidationPipe())
    // @UseInterceptors(ClassSerializerInterceptor)
    // @SerializeOptions({excludePrefixes: ['_']})
    // @Post('/signUp')
    // async signUp(@Body() signUpDto: SignUpDto) {
    //     return this.authorizationService.signUp(signUpDto);
    // }
}
