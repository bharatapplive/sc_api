import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

const imageUploadDirectory = join(process.cwd(), 'uploads', 'images');

if (!existsSync(imageUploadDirectory)) {
  mkdirSync(imageUploadDirectory, { recursive: true });
}

interface AuthenticatedRequest extends Request {
  user?: {
    sub?: string;
  };
}


interface UploadedImageFile {
  filename: string;
}

@Controller('auth')
export class AuthController {
    // step 3 DI
  constructor(private readonly authService: AuthService) {}

  
  // step 4 create api for user registration
  @Post('create')
  @Public()
  async create(@Body() requestData: any) {
    return this.authService.create(requestData);
  }

  @Post('login')
   @Public()
  async login(@Body() requestData: any) {
    return this.authService.login(requestData);
  }

  //  created endpoint tp fetch all users except the current user based on their mobile number
  // localhost:3000/auth/users
  @Post('users')
  findUsersExceptCurrent(@Body('mobile') currentMobile: string) {
    if (!currentMobile) {
      throw new BadRequestException('Current user mobile number is required');
    }

    return this.authService.findAllExcept(currentMobile);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: imageUploadDirectory,
        filename: (_request, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
      },
    }),
  )
  async saveImage(
    @UploadedFile() file: UploadedImageFile,
    @Req() request: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('An image file is required');
    }

    const userId = request.user?.sub;

    if (!userId) {
      throw new BadRequestException('Authenticated user was not found');
    }

    const imagePath = `uploads/images/${file.filename}`;
    const user = await this.authService.saveImage(userId, imagePath);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    return {
      message: 'Image saved successfully',
      image: imagePath,
      user,
    };
  }

}
