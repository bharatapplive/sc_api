import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AuthModel } from './auth.model';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth')
    private readonly authModel: Model<AuthModel>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // REGISTRATION
  // =========================

  async create(requestData: any): Promise<AuthModel> {

    // Check mobile already exists
    const existingMobile = await this.authModel.findOne({
      mobile: requestData.mobile,
    });

    if (existingMobile) {
      throw new ConflictException(
        'Mobile number already registered',
      );
    }

    // Check username already exists
    const existingUserName = await this.authModel.findOne({
      userName: requestData.userName,
    });

    if (existingUserName) {
      throw new ConflictException(
        'Username already registered',
      );
    }

    // Create new user
    const createdAuth = new this.authModel({
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      userName: requestData.userName,
      email: requestData.email,
      mobile: requestData.mobile,
      password: requestData.password,

      // Don't take role from frontend
      role: 'user',

      // Default active user
      isActive: true,
    });

    return await createdAuth.save();
  }

  // =========================
  // LOGIN
  // =========================

  async login(requestData: any) {

    const user = await this.authModel.findOne({
      mobile: requestData.mobile,
      password: requestData.password,
    });

    if (!user) {
      return null;
    }

    const payload = {
      sub: user._id,
      mobile: user.mobile,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),

      user: {
        _id: user._id,
        mobile: user.mobile,
        role: user.role,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}