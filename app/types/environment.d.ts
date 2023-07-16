import { IJwtUser, User } from '.';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_URL: string,

      DB_HOST: string,
      DB_PORT: string,
      DB_NAME: string,
      DB_USER: string,
      DB_PASSWORD: string,


      AUTH0_JWKS_URI: string,
      AUTH0_AUDIENCE: string,
      AUTH0_ISSUER: string,

      EMAIL_ADDRESS: string,
      EMAIL_PASSWORD: string,
    }
  }

  namespace Express {
    interface Request {
      auth: IJwtUser,
      user: User,
    }
  }
}

export {};