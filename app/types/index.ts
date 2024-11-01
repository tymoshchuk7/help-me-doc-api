export type TRole = 'chief' | 'patient' | 'doctor' | 'admin';

export enum Permissions {
  CAN_INVITE_USERS = 'CAN_INVITE_USERS',
  CAN_SEE_INVITATIONS = 'CAN_SEE_INVITATIONS',
}

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

export interface ITableNames {
  participants_table: string,
  chats_table: string,
  messages_table: string,
  chat_members_table: string,
  media_table: string,
}

export enum GlobalTableNames {
  users = 'users',
  tenants = 'tenants',
  invitations = 'invitations',
  diseases = 'diseases',
}

export interface User {
  id: string,
  default_tenant: string,
  email: string,
  avatar: string,
  last_name: string,
  first_name: string,
  phone_number: string,
}

export interface Tenant {
  id: string,
  user_id: string,
  name: string,
  tenant_name: string,
  tenant_participants_table: string,
  tenant_chats_table: string,
  tenant_messages_table: string,
  tenant_chats_members_table: string,
  tenant_media_table: string,
}

export interface Disease {
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
  role: TRole,
}

export interface TenantParticipant {
  id: string,
  user_id: string,
  status: string,
  role: TRole,
}

export interface TenantChat {
  id: string,
  participant_id: string,
}

export interface TenantChatMember {
  id: string,
  participant_id: string,
  chat_id: string,
  user_id: string,
}

export interface TenantMessage {
  id: string,
  participant_id: string,
  chat_id: string,
  content: string,
  sent_timestamp: string,
}

export interface TenantMedia {
  id: string,
  message_id: string,
  bucket_name: string,
}

export interface ModelMeta {
  id: string,
  [key: string]: any,
}

export type TenantTableName = keyof Omit<Tenant, 'id' | 'tenant_name' | 'user_id'>;
