import { Body, Controller, Post, Get, Session, Param } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
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
    return null;
  }

  @Post('/tfa/:bool')
  async enableTFA(@Param('bool') bool: string, @CurrentUser() user) {
    return this.authService.toggleTFA(bool === 'true' ? true : false, user);
  }

  @Post('otp/:otp')
  async checkOTP(@Param('otp') otp: string, @CurrentUser() user: any) {    
    return this.authService.checkOTP(otp, user);
  }
}
