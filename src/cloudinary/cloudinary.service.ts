import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

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

  private s3Client: S3Client;
  private bucketName: string;


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




    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
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


  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log("file", file)
    const fileKey = `uploads/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileKey}`;
  }
}
