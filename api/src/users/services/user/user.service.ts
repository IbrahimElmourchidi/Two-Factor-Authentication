import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/Entities/user.entity';
import { UserDto } from 'src/users/Dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  createUser(body: UserDto): Promise<UserEntity> {
    let newUser = this.repo.create(body);
    return this.repo.save(newUser);
  }

  findOne(id: number): Promise<UserEntity> {
    if (!id) throw new NotFoundException(null);
    return this.repo.findOne({ where: { id } });
  }
  find(email: string): Promise<UserEntity[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attr: Partial<UserEntity>) {
    let user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attr);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
