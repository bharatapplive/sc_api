import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    this.configure();
  }

  private configure() {
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

    this.configure();

    try {
      console.log(`[Cloudinary] Uploading image to folder '${folder}'...`);
      const result: UploadApiResponse = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });
      console.log(`[Cloudinary] Upload successful! URL: ${result.secure_url}`);
      return result.secure_url;
    } catch (error: any) {
      console.error('[Cloudinary] Upload failed:', error?.message || error);
      // Fall back to original string so the image is still saved to MongoDB
      return fileStr;
    }
  }
}

