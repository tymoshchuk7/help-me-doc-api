import { ITableNames } from '../types';

export const getTenantName = (userId: string, table: string) => `tenant_${userId}_${table}`;

export const getTenantTablesNames = (userId: string): ITableNames => ({
  participants_table: getTenantName(userId, 'participants'),
  chats_table: getTenantName(userId, 'chats'),
  messages_table: getTenantName(userId, 'messages'),
  chat_members_table: getTenantName(userId, 'chat_members'),
  media_table: getTenantName(userId, 'media'),
  diseases_table: getTenantName(userId, 'diseases'),
});