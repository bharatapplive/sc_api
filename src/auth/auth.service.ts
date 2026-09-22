import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema/user.schema';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // REGISTER
  // =========================
  async register(registerDto: RegisterDto) {
    const { emailOrMobile, password } = registerDto;

    const existingUser = await this.userModel.findOne({
      emailOrMobile,
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already registered',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      emailOrMobile,
      password: hashedPassword,
    });

    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        emailOrMobile: user.emailOrMobile,
      },
    };
  }

  // =========================
  // LOGIN
  // =========================
  async login(loginDto: LoginDto) {
    const { emailOrMobile, password } = loginDto;

    const user = await this.userModel.findOne({
      emailOrMobile,
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email/mobile or password',
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid email/mobile or password',
      );
    }

    const payload = {
      sub: user._id.toString(),
      emailOrMobile: user.emailOrMobile,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user._id,
        emailOrMobile: user.emailOrMobile,
      },
    };
  }
}