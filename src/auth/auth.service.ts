import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && (await this.usersService.validatePassword(password, user.password))) {
      return user;
    }
    
    return null;
  }

  async login(user: User): Promise<{
    access_token: string;
    user: Omit<User, 'password'>;
    expires_in: string;
  }> {
    const payload = { email: user.email, sub: user.id };
    const expiresIn = this.configService.get('JWT_EXPIRATION', '1d');
    
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      notes: user.notes,
      fullName: user.fullName,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
      expires_in: expiresIn,
    };
  }

  async register(registerDto: RegisterDto): Promise<{
    access_token: string;
    user: Omit<User, 'password'>;
    expires_in: string;
  }> {
    const user = await this.usersService.create(registerDto);
    return this.login(user);
  }
}