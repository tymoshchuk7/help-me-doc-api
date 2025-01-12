export type TRole = 'chief' | 'patient' | 'doctor' | 'admin';

export enum Permissions {
  CAN_INVITE_USERS = 'CAN_INVITE_USERS',
  CAN_SEE_INVITATIONS = 'CAN_SEE_INVITATIONS',
  CAN_SEND_MESSAGES = 'CAN_SEND_MESSAGES',
  CAN_CREATE_DISEASES = 'CAN_CREATE_DISEASES',
  CAN_VIEW_DISEASES = 'CAN_VIEW_DISEASES',
  CAN_VIEW_PARTICIPANTS = 'CAN_VIEW_PARTICIPANTS',
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
  diseases_table: string,
}

export enum GlobalTableNames {
  users = 'users',
  tenants = 'tenants',
  invitations = 'invitations',
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
  tenant_diseases_table: string,
}

export interface TenantDisease {
  id: string,
  doctor_participant_id: string,
  patient_participant_id: string,
  name: string,
  status: 'active' | 'resolved' | 'chronic',
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
}

export interface TenantChatMember {
  id: string,
  participant_id: string,
  chat_id: string,
  last_read_message_id: string | null,
}

export interface TenantMessage {
  id: string,
  chat_member_id: string,
  chat_id: string,
  content: string,
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
