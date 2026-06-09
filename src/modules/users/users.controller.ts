import { Request } from '@nestjs/common';

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  create(
    @Body()
    dto: CreateUserDto,
  ) {
    return this.usersService.createUser(
      dto,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return req.user;
  }
}