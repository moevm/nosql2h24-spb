import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JWT_SECRET} from "./auth.constants";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
                private readonly reflector: Reflector,
                @Inject(JWT_SECRET) private readonly jwtSecret: string,
    ) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const isPublic = this.reflector.getAllAndOverride("IS_PUBLIC", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException();
        }
        try {
            request.user = await this.jwtService.verify(token, {secret: this.jwtSecret});
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}
