import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Put,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user: User = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() signupDto: Partial<User>) {
    return this.authService.signup(signupDto);
  }

  @Put('me')
  async updateProfile(@Body() signupDto: Partial<User>) {
    return this.authService.updateProfile(signupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getUserById(req.user.email);
  }
}
