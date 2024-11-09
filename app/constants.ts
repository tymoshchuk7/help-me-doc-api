import { Permissions, TRole } from './types';

export const ROLE_PERMISSIONS: Record<TRole, Set<Permissions>> = {
  chief: new Set([
    Permissions.CAN_INVITE_USERS,
    Permissions.CAN_SEND_MESSAGES,
    Permissions.CAN_CREATE_DISEASES,
  ]),
  patient: new Set([
    Permissions.CAN_SEND_MESSAGES,
  ]),
  doctor: new Set([
    Permissions.CAN_SEND_MESSAGES,
    Permissions.CAN_CREATE_DISEASES,
  ]),
  admin: new Set([
    Permissions.CAN_INVITE_USERS,
  ]),
};