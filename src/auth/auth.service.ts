import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(

    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
    private readonly jwtService: JwtService,
  ) {}


  async create(requestData: any): Promise<AuthModel> {

    const createdAuth = new this.authModel({
      ...requestData,

    });


    return await createdAuth.save();
  }

  async login(requestData: any) {
    const user = await this.authModel.findOne({
      mobile: requestData.mobile,
      password: requestData.password,
    });

    if (!user) {
      return null;
    }
//step 4
    const payload = {
      sub: user._id,
      mobile: user.mobile,
      role: user.role,
    };
//step 5 created a token and return
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