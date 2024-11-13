import { Body, Controller, Get, Post } from '@nestjs/common';
import { checkUserDto, createUserDto } from './dto';
import { AuthorizationService } from './authorization.service';
import { Neo4jService } from 'nest-neo4j/dist';

@Controller()
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService,
    private readonly neo4jService: Neo4jService
  ) {}

  @Get( '/signIn' )
  signIn(@Body() checkUserDto: checkUserDto) {
    return this.authorizationService.signIn(
      this.neo4jService, 
      checkUserDto.userEmail, 
      checkUserDto.userPassword
    )
  }

  @Post( '/signUp' )
  signUp(@Body() createUserDto: createUserDto) {
    return this.authorizationService.signUp(
      this.neo4jService, 
      createUserDto.userEmail, 
      createUserDto.userPassword,
      createUserDto.userName
    )
  }

  @Get( '/check-user' )
  checkUser() {}

  @Post( '/logout' )
  logOut() {
    return 
  }
}
