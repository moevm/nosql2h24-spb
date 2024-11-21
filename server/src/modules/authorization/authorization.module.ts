import {Module} from '@nestjs/common';
import {AuthorizationController} from './authorization.controller';
import {AuthorizationService} from './authorization.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JWT_SECRET} from "./auth.constants";
import {JwtGuard} from "./jwt.guard";


@Module({
    imports: [
        UsersModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [AuthorizationModule],
            inject: [JWT_SECRET],
            useFactory: (jwtSecret: string) => ({
                global: true,
                secret: jwtSecret,
                signOptions: {expiresIn: "15m"},
            })
        }),
    ],
    controllers: [AuthorizationController],
    providers: [
        AuthorizationService,
        {
            inject: [ConfigService],
            provide: JWT_SECRET,
            useFactory: (configService: ConfigService): string => configService.get('JWT_SECRET') ?? 'secret',
        },
        {provide: 'APP_GUARD', useClass: JwtGuard},
    ],
    exports: [JWT_SECRET],
})

export class AuthorizationModule {
}
