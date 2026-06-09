
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  create(data: Partial<User>) {
    return this.usersRepository.save(data);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async createUser(
    dto: CreateUserDto,
  ) {
    const existingUser =
      await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const passwordHash =
      await bcrypt.hash(
        dto.password,
        10,
      );

    const user =
      this.usersRepository.create({
        email: dto.email,
        passwordHash,
        role: dto.role as any,
      });

    return this.usersRepository.save(
      user,
    );
  }
}