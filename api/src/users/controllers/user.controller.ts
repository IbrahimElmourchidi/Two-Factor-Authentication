import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { UpdateUserDto } from '../Dtos/update-user.dto';
import { UserSerializeDto } from '../Dtos/user-serialize.dto';
import { UserDto } from '../Dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserService } from '../services/user/user.service';

@Serialize(UserSerializeDto)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  async findAll(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
