import { Module } from '@nestjs/common';

import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthenticationService],
  controllers: [UserController, AuthenticationController],
})
export class UsersModule {}
