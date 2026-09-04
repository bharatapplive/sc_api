import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(requestData: any): Promise<AuthModel> {
    let avatarUrl = requestData.avatar;
    if (avatarUrl && !avatarUrl.startsWith('assets/')) {
      avatarUrl = await this.cloudinaryService.uploadImage(
        avatarUrl,
        'social_circle/avatars',
      );
    }

    const createdAuth = new this.authModel({
      ...requestData,
      avatar: avatarUrl || 'assets/images/user-profile.jpg',
    });

    return await createdAuth.save();
  }

  async login(requestData: any) {
    const user = await this.authModel.findOne({
      $or: [
        { userName: requestData.userName },
        { mobile: requestData.mobile },
        { email: requestData.email },
      ],
      password: requestData.password,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Invalid username/mobile/email or password',
      );
    }
    return {
      status: 'Login',
      message: 'Login successfully',
      user: {
        id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async updateAvatar(userId: string, avatar: string) {
    let avatarUrl = avatar;
    if (avatarUrl && !avatarUrl.startsWith('assets/')) {
      avatarUrl = await this.cloudinaryService.uploadImage(
        avatarUrl,
        'social_circle/avatars',
      );
    }

    const updated = await this.authModel.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true },
    );
    if (!updated) {
      throw new UnauthorizedException('User not found');
    }
    return {
      status: 'Success',
      message: 'Avatar updated successfully',
      avatar: updated.avatar,
    };
  }
}
