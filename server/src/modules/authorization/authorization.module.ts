import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
})
export class AppModule {}
