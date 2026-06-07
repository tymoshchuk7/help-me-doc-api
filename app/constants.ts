import { Permissions, UserRole } from './types';

export const ROLE_PERMISSIONS: Record<UserRole, Set<Permissions>> = {
  [UserRole.CHIEF]: new Set([
    Permissions.CAN_INVITE_USERS,
    Permissions.CAN_SEND_MESSAGES,
    Permissions.CAN_CREATE_DISEASES,
    Permissions.CAN_VIEW_PARTICIPANTS,
    Permissions.CAN_VIEW_DISEASES,
    Permissions.CAN_VIEW_APPOINTMENTS,
    Permissions.CAN_CREATE_APPOINTMENTS,
  ]),
  [UserRole.PATIENT]: new Set([
    Permissions.CAN_SEND_MESSAGES,
  ]),
  [UserRole.DOCTOR]: new Set([
    Permissions.CAN_SEND_MESSAGES,
    Permissions.CAN_CREATE_DISEASES,
    Permissions.CAN_VIEW_PARTICIPANTS,
    Permissions.CAN_VIEW_DISEASES,
    Permissions.CAN_VIEW_APPOINTMENTS,
    Permissions.CAN_CREATE_APPOINTMENTS,
  ]),
  [UserRole.ADMIN]: new Set([
    Permissions.CAN_VIEW_PARTICIPANTS,
    Permissions.CAN_INVITE_USERS,
  ]),
};