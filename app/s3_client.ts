import * as Minio from 'minio';
import { config } from './config';

const s3Client = new Minio.Client({
  endPoint: config.S3_URL,
  port: 9000,
  useSSL: false,
  accessKey: config.S3_ACCESS_KEY_ID,
  secretKey: config.S3_SECRET_ACCESS_KEY,
});

export const preUploadFile = async (name: string): Promise<string> => {
  return s3Client.presignedPutObject(config.S3_BUCKET_NAME, name, 60 * 60);
};

export const getSignedUrl = (name: string) => {
  return s3Client.presignedUrl('GET', config.S3_BUCKET_NAME, name, 60 * 60);
};
