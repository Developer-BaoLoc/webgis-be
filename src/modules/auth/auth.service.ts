import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken:
        await this.jwtService.signAsync(
          payload,
        ),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}