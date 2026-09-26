import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { StoryService } from './story.service';
import { StoryModel } from './story.model';

const imageUploadDirectory = join(process.cwd(), 'uploads', 'images');

if (!existsSync(imageUploadDirectory)) {
  mkdirSync(imageUploadDirectory, { recursive: true });
}

interface UploadedImageFile {
  filename: string;
}


@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
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
  async createStory(
    @UploadedFile() file: UploadedImageFile,
    @Body() requestData: Omit<StoryModel, 'image'>,
  ): Promise<StoryModel> {
    if (!file) {
      throw new BadRequestException('An image file is required');
    }
//1. we are saving image in upload /images folder
    const imagePath = `uploads/images/${file.filename}`;

    const storyData = {
      ...requestData,
    // 2. we are saving image path in story model/ table
      image: imagePath,
    } as StoryModel;

    //3 . we are calling story service to save story data in database
    return this.storyService.createStory(storyData);
  }
}


// post
// post ('create-story')// localhost:3000/story/create-story route for creating a story with image upload
// get
// get route for fetching stories
// put
// put route for updating a story
// delete
// delete route for deleting a story