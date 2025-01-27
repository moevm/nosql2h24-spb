import { Injectable, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthorizationService {
    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService) {
    }

    @UsePipes(new ValidationPipe())
    async signIn(signInDto: SignInDto) {
        const user = await this.usersService.findOneByEmail(signInDto.email);
        const isCorrect = await compare(signInDto.password, user._password);

        if (!isCorrect) {
            throw new UnauthorizedException()
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        user._password = undefined;
        return { access_token: await this.jwtService.signAsync(payload), user: user };
    }

    @UsePipes(new ValidationPipe())
    async signUp(signUpDto: SignUpDto) {
        const user = await this.usersService.create({ ...signUpDto, role: "USER" });
        const payload = { sub: user.id, email: user.email, role: user.role };
        user._password = undefined;
        return { access_token: await this.jwtService.signAsync(payload), user: user }
    }
}
