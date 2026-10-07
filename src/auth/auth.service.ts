import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
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
      avatar: avatarUrl || 'assets/images/default-avatar.png',
      isProfileComplete: false,
    });

    return await createdAuth.save();
  }

  async login(requestData: any) {
    const user = await this.authModel.findOne({
      $or: [
        { userName: requestData.identity },
        { mobile: requestData.identity },
        { email: requestData.identity },
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
      access_token: this.jwtService.sign({
        sub: user._id,
        userName: user.userName,
        role: user.role,
      }),
      user: {
        id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar || 'assets/images/default-avatar.png',
        bio: user.bio || '',
        isProfileComplete:
          user.isProfileComplete ??
          (!!user.bio &&
            !user.avatar?.includes('default-avatar.png') &&
            !user.avatar?.includes('user-profile.jpg')),
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

  async updateProfile(
    userId: string,
    data: {
      avatar?: string;
      bio?: string;
      firstName?: string;
      lastName?: string;
      userName?: string;
      website?: string;
      category?: string;
    },
  ) {
    const updatePayload: any = {
      isProfileComplete: true,
    };

    if (data.bio !== undefined) {
      updatePayload.bio = data.bio;
    }
    if (data.firstName !== undefined) {
      updatePayload.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      updatePayload.lastName = data.lastName;
    }
    if (data.userName !== undefined) {
      updatePayload.userName = data.userName;
    }
    if (data.website !== undefined) {
      updatePayload.website = data.website;
    }
    if (data.category !== undefined) {
      updatePayload.category = data.category;
    }

    if (data.avatar) {
      let avatarUrl = data.avatar;
      if (!avatarUrl.startsWith('assets/')) {
        avatarUrl = await this.cloudinaryService.uploadImage(
          avatarUrl,
          'social_circle/avatars',
        );
      }
      updatePayload.avatar = avatarUrl;
    }

    const updated = await this.authModel.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true },
    );

    if (!updated) {
      throw new UnauthorizedException('User not found');
    }

    return {
      status: 'Success',
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        userName: updated.userName,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        mobile: updated.mobile,
        avatar: updated.avatar,
        bio: updated.bio,
        website: updated.website,
        category: updated.category,
        role: updated.role,
        isProfileComplete: updated.isProfileComplete,
      },
    };
  }
}
