import dotenv from 'dotenv';

dotenv.config();

export const config = {
  auth0JwksUri: process.env.AUTH0_JWKS_URI,
  auth0Issuer: process.env.AUTH0_ISSUER,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridEmail: process.env.SENDGRID_EMAIL,
  appUrl: process.env.APP_URL,
  redisUrl: process.env.REDIS_URL,
  apiThrottleRate: process.env.API_THROTTLE_RATE,
  appPort: process.env.PORT || 8000,
  databaseConnectionUrl: process.env.DB_URL,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_URL: process.env.S3_URL,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};