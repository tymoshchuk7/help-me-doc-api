import { Permissions, TRole } from './types';

export const ROLE_PERMISSIONS: Record<TRole, Set<Permissions>> = {
  chief: new Set([
    Permissions.CAN_INVITE_USERS,
  ]),
  patient: new Set([]),
  doctor: new Set([
  ]),
  admin: new Set([
    Permissions.CAN_INVITE_USERS,
  ]),
};
