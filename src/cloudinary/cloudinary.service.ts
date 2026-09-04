import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    fileStr: string,
    folder: string = 'social_circle/avatars',
  ): Promise<string> {
    // If it's a local placeholder asset, return as-is
    if (!fileStr || fileStr.startsWith('assets/')) {
      return fileStr;
    }

    // If already hosted on cloudinary, return as-is
    if (fileStr.includes('cloudinary.com')) {
      return fileStr;
    }

    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // Fall back to original string if upload fails
      return fileStr;
    }
  }
}
