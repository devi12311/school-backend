import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Put, InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

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

  @Post('gorse-user')
  async createGorseUser(@Body() body: { tags: string[] }) {
    const userId = uuidv4();
    const finished = await this.authService.createGorseUser({ UserId: userId, Labels: body.tags });
    if (!finished) {
      throw new InternalServerErrorException('Failed to create Gorse user');
    }
    return { userId };
  }
}
