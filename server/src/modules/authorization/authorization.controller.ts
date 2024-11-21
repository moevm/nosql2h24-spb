import {Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthorizationService} from './authorization.service';
import {SignInDto} from "./dto/sign-in.dto";
import {Public} from "./public.decorator";

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
}
