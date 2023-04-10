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

export interface User {
  id: string,
  defaultTenant: string,
  email: string,
  avatar: string,
  last_name: string,
  first_name: string,
  phone_number: string,
}

export interface Tenant {
  id: string,
  user_id: string,
  tenant_name: string,
  tenant_participants_table: string,
  tenant_chats_table: string,
  tenant_messages_table: string,
  tenant_chats_members_table: string,
}

export interface Diseases {
  id: string,
  user_id: string,
  name: string,
  status: string,
  description: string,
  treatment: string,
}

export interface Invitation {
  id: string,
  tenant: string,
  email: string,
}