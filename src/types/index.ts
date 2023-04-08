export interface IJwtUser {
  meta_data: {
    first_name: string;
    last_name: string;
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

export interface ITableNames {
  participants_table: string,
  chats_table: string,
  messages_table: string,
  chat_members_table: string
}
