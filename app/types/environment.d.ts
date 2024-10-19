import { IJwtUser, User, TenantParticipant } from '.';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      APP_URL: string,
      API_THROTTLE_RATE: string,
      REDIS_URL: string,

      DB_HOST: string,
      DB_PORT: string,
      DB_NAME: string,
      DB_USER: string,
      DB_PASSWORD: string,


      AUTH0_JWKS_URI: string,
      AUTH0_AUDIENCE: string,
      AUTH0_ISSUER: string,

      SENDGRID_EMAIL: string,
      SENDGRID_API_KEY: string,
    }
  }

  namespace Express {
    interface Request {
      auth: IJwtUser,
      user: User,
      tenantParticipant: TenantParticipant | null,
    }
  }
}

export {};