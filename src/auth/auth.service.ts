import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(userData: Partial<User>) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password as string, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userData: Partial<User>) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User does not exist');
    }

    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Update the user
    await this.usersRepository.update({ id: existingUser.id }, userData);

    // Get the updated user
    const updatedUser = await this.usersRepository.findOne({
      where: { id: existingUser.id },
    });

    if (!updatedUser) {
      throw new UnauthorizedException('Failed to update user');
    }

    const { password, ...result } = updatedUser;
    return result;
  }

  async getUserById(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}
