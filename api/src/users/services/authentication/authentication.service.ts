import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
// import speakesasy from 'speakeasy';
const speakesasy = require('speakeasy');
const qr = require('qrcode');
import { UserDto } from 'src/users/Dtos/user.dto';
import { UserEntity } from 'src/users/Entities/user.entity';
import { UserI } from 'src/users/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService) {}

  async signin(body: UserDto): Promise<UserEntity> {
    // check if the user actually exists
    const [user] = await this.userService.find(body.email);
    if (!user) throw new NotFoundException('invalid credentials');
    const passValid = await compare(body.password, user.password);
    if (!passValid) throw new NotFoundException('invalid credentials');
    return user;
  }

  async signup(body: UserDto) {
    // find if the user already exists
    let user = await this.userService.find(body.email);
    if (user.length)
      throw new ConflictException('user with that email already exists');
    //generate the hashed password
    let hashedPassword = await hash(body.password, 10);
    body.password = hashedPassword;
    // save the new user
    return this.userService.createUser(body);
  }

  async toggleTFA(bool: boolean, user: UserI) {
    user.multiFactor = !user.multiFactor;
    let qrPicture = '';
    if (bool) {
      let secret = speakesasy.generateSecret({
        name: (Math.random() + 1).toString(36).substring(7),
      });
      user.secret = secret.ascii;
      user.multiFactor = true;
      qrPicture = await qr.toDataURL(secret.otpauth_url);
    } else {
      user.secret = null;
      user.multiFactor = false;
    }
    await this.userService.update(user.id, user);
    return JSON.stringify(qrPicture);
  }

  async checkOTP(otp: string, user: UserI) {
    console.log(user);
    let valid = speakesasy.totp.verify({
      secret: user.secret,
      encoding: 'ascii',
      token: otp,
    });
    console.log(valid);
    return valid;
  }
}
