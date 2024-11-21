import {
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
import {AuthorizationService} from './authorization.service';
import {SignInDto} from "./dto/sign-in.dto";
import {Public} from "./public.decorator";
import {SignUpDto} from "./dto/sign-up.dto";

@Public()
@Controller('/api/auth')
export class AuthorizationController {
    constructor(private readonly authorizationService: AuthorizationService) {
    }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    @Post('/signIn')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authorizationService.signIn(signInDto);
    }


    @UsePipes(new ValidationPipe())
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({excludePrefixes: ['_']})
    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authorizationService.signUp(signUpDto);
    }
}
