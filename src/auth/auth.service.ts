import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const taken = await this.usersService.exists(dto.email, dto.mobile, dto.userName);
        if (taken) {
            throw new ConflictException('Email, mobile or username already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({ ...dto, password: hashedPassword });
        return this.buildResponse(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findForLogin(dto.identifier);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.buildResponse(user);
    }

    // token banao + password hata ke user bhejo
    private buildResponse(user: UserDocument) {
        const token = this.jwtService.sign({ sub: user._id.toString() });
        const { password: _password, ...safeUser } = user.toObject();
        return { token, user: safeUser };
    }
}