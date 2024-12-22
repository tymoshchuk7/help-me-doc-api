import { IJwtUser, User, TenantParticipant } from '.';
import { TenantControllerSet } from '../controllers';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      APP_URL: string,
      API_THROTTLE_RATE: string,
      REDIS_URL: string,
      DB_URL: string,

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
      tenant: TenantControllerSet,
      tenantParticipant: TenantParticipant,
    }
  }
}

export {};