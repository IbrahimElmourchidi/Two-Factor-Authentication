import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
// const bcrypt = require('bcrypt')

import { UserDto } from 'src/users/Dtos/user.dto';
import { UserEntity } from 'src/users/Entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService) {}

  async signin(body: UserDto):Promise<UserEntity> {
    // check if the user actually exists
    const [user] = await this.userService.find(body.email);
    if (!user) throw new NotFoundException('invalid credentials');
    const passValid = await compare(body.password, user.password)
    if(!passValid) throw new NotFoundException('invalid credentials');
    return user
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
}
