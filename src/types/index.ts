export interface IJwtUser {
  meta_data: {
    given_name: string;
    family_name: string;
  },
  picture: string,
  email: string;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface AccessError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export interface AuthRequest<B = any> {
  body: B;
  auth: IJwtUser;
  user: Record<string, string>
}

