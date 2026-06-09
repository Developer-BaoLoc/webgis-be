import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';



@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(
      dto.email,
      dto.password,
    );
  }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Request() req) {
        return req.user;
    }
}