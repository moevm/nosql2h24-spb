import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import { WalksService } from '../walks/walks.service';
import { DotsService } from '../dot/dots.service';
import { PointsOfInterestService } from '../points-of-interest/points-of-interest.service';
import { RoutesService } from '../routes/routes.service';

@Injectable()
export class ShowDbEntriesService {
    constructor(private readonly usersService: UsersService,
                private readonly walksService: WalksService,
                private readonly dotsService: DotsService,
                private readonly pointsOfInterestService: PointsOfInterestService,
                private readonly routesService: RoutesService
    ) {
    }

    async getAllDataBase() {
        return {
            "USERS"                 : this.getUsers(),
            "WALKS"                 : this.getWalks(),
            "DOTS"                  : this.getDots(),
            "POINTS_OF_INTEREST"    : this.getPOIs(),
            "ROUTES"                : this.getRoutes()
        }
    }

    async getUsers() {
        return this.usersService.findAll();
    }

    async getWalks() {
        return this.walksService.findAll();
    }

    async getDots() {
        return this.dotsService.findAll();
    }

    async getPOIs() {
        return this.pointsOfInterestService.findAll();
    }

    async getRoutes() {
        return this.routesService.findAll();
    }

    // async signIn(signInDto: SignInDto) {
    //     const user = await this.usersService.findOneByEmail(signInDto.email);
    //     const isCorrect = await compare(signInDto.password, user._password);

    //     if (!isCorrect) {
    //         throw new UnauthorizedException()
    //     }

    //     const payload = {sub: user.id, email: user.email, role: user.role};
    //     return {access_token: await this.jwtService.signAsync(payload)};
    // }


    // async signUp(signUpDto: SignUpDto) {
    //     const user = await this.usersService.create({...signUpDto, role: "USER"});
    //     const payload = {sub: user.id, email: user.email, role: user.role};
    //     return {access_token: await this.jwtService.signAsync(payload), user: user}
    // }
}
