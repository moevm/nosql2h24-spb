import { Module } from '@nestjs/common';
import { ShowDbEntriesController } from './show-db-entries.controller';
import { ShowDbEntriesService } from './show-db-entries.service';
import { UsersModule } from "../users/users.module";
import { WalksModule } from '../walks/walks.module';
import { DotsModule } from '../dot/dots.module';
import { PointsOfInterestModule } from '../points-of-interest/points-of-interest.module';
import { RoutesModule } from '../routes/routes.module';


@Module({
    imports: [
        UsersModule,
        WalksModule,
        DotsModule,
        PointsOfInterestModule,
        RoutesModule

        // ConfigModule,
        // JwtModule.registerAsync({
        //     imports: [AuthorizationModule],
        //     inject: [JWT_SECRET],
        //     useFactory: (jwtSecret: string) => ({
        //         global: true,
        //         secret: jwtSecret,
        //         signOptions: {expiresIn: "15m"},
        //     })
        // }),
    ],
    controllers: [ShowDbEntriesController],
    providers: [
        ShowDbEntriesService,
        // {
        //     inject: [ConfigService],
        //     provide: JWT_SECRET,
        //     useFactory: (configService: ConfigService): string => configService.get('JWT_SECRET'),
        // },
        // {provide: 'APP_GUARD', useClass: JwtGuard},
    ],
})

export class ShowDbEntriesModule {
}
