import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // step 3 DI
  constructor(private readonly authService: AuthService) { }


  // step 2
  @Post('create')
  async create(@Body() requestData: any) {
    return this.authService.create(requestData);
  }

  @Post('login')
  async login(@Body() requestData: any) {
    return this.authService.login(requestData);
  }

  @Post('update-avatar')
  async updateAvatar(@Body() body: { userId: string; avatar: string }) {
    return this.authService.updateAvatar(body.userId, body.avatar);
  }

  @Post('update-profile')
  async updateProfile(
    @Body()
    body: {
      userId: string;
      avatar?: string;
      bio?: string;
      firstName?: string;
      lastName?: string;
      userName?: string;
      website?: string;
      category?: string;
    },
  ) {
    return this.authService.updateProfile(body.userId, {
      avatar: body.avatar,
      bio: body.bio,
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName,
      website: body.website,
      category: body.category,
    });
  }
}

