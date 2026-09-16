import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as Minio from 'minio';
import config from 'config/env';
import { AppError } from 'middlewares/error';
import type {
  IStorageProvider,
  UploadedFileResult,
  UploadOptions,
} from '../types';

class MinioStorageProvider implements IStorageProvider {
  readonly name = 'minio' as const;
  private client: Minio.Client;
  private bucket: string;
  private bucketReady: Promise<void> | null = null;

  constructor() {
    const missing = [
      'MINIO_ENDPOINT',
      'MINIO_ACCESS_KEY',
      'MINIO_SECRET_KEY',
      'MINIO_BUCKET',
    ].filter((k) => !config[k as keyof typeof config]);
    if (missing.length) {
      throw new AppError(
        `Missing MinIO configuration: ${missing.join(', ')}`,
        500
      );
    }

    this.bucket = config.MINIO_BUCKET as string;
    this.client = new Minio.Client({
      endPoint: config.MINIO_ENDPOINT as string,
      port: config.MINIO_PORT,
      useSSL: config.MINIO_USE_SSL,
      accessKey: config.MINIO_ACCESS_KEY as string,
      secretKey: config.MINIO_SECRET_KEY as string,
    });
  }

  private async ensureBucket(): Promise<void> {
    if (!this.bucketReady) {
      this.bucketReady = (async () => {
        const exists = await this.client.bucketExists(this.bucket);
        if (!exists) {
          await this.client.makeBucket(this.bucket);
        }
      })();
    }
    return this.bucketReady;
  }

  async upload(
    file: Express.Multer.File,
    options?: UploadOptions
  ): Promise<UploadedFileResult> {
    await this.ensureBucket();

    const folder = options?.folder ? options.folder.replace(/^\/+|\/+$/g, '') : '';
    const ext = path.extname(file.originalname);
    const key = folder ? `${folder}/${uuidv4()}${ext}` : `${uuidv4()}${ext}`;

    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return {
      key,
      url: this.getUrl(key),
      provider: this.name,
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  getUrl(key: string): string {
    if (config.MINIO_PUBLIC_URL) {
      return `${config.MINIO_PUBLIC_URL.replace(/\/+$/, '')}/${key}`;
    }
    const protocol = config.MINIO_USE_SSL ? 'https' : 'http';
    return `${protocol}://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${this.bucket}/${key}`;
  }
}

export default MinioStorageProvider;
