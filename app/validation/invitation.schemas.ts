import { Schema } from 'express-validator';
import { UserRole } from '../types';

const userInvitationRole = Object.values(UserRole).filter((i) => i != UserRole.CHIEF);

const createSchema: Schema = {
  'data.email': { isEmail: true },
  'data.role': { isIn: { options: [userInvitationRole] } },
};

export default { createSchema };
