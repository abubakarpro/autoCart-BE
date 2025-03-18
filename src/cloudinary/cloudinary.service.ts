import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
  ];

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new HttpException(
        'Missing Cloudinary configuration values.',
        HttpStatus.FORBIDDEN,
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  private validateImageFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types are: ${this.allowedMimeTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      this.validateImageFile(file);
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'uploads',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result as UploadApiResponse);
            },
          )
          .end(file.buffer);
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<UploadApiResponse[]> {
    try {
      files.forEach(file => this.validateImageFile(file));
      const uploadPromises = files.map(file => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw error;
    }
  }
}
