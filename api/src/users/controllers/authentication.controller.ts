import { Body, Controller, Post, Get, Session, Param } from '@nestjs/common';
import { UserSerializeDto } from '../Dtos/user-serialize.dto';
import { UserDto } from '../Dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';

@Serialize(UserSerializeDto)
@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/signin')
  async singin(@Body() body: UserDto, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signup')
  async signup(@Body() body: UserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }
}
