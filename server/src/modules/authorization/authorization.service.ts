import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {SignInDto} from "./dto/sign-in.dto";
import {compare} from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthorizationService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.usersService.findOneByEmail(signInDto.email);
        const isCorrect = await compare(signInDto.password, user.password);

        if (!isCorrect) {
            throw new UnauthorizedException()
        }

        const payload = {sub: user.id, email: user.email, role: user.role};
        return {access_token: await this.jwtService.signAsync(payload)};
    }
}
