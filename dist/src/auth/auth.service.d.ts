import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
        expires_in: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
        expires_in: string;
    }>;
}
