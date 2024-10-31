import { Request, Response, Router } from 'express';
import { Schema } from 'express-validator';
import {
  authenticateUser, checkParticipantPermissions, validate,
} from '../../middlewares';
import { Permissions } from '../../types';

import post from './post';
import get from './get';
import retrieve from './retrieve';
import accept from './accept';

const invitationValidationSchema: Schema = {
  'data.email': { isEmail: true },
  'data.role': { isIn: { options: [['patient', 'doctor', 'admin']] } },
};

export default Router()
  .post(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_INVITE_USERS]),
    ...validate(invitationValidationSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_SEE_INVITATIONS]),
    (req: Request, res: Response) => void get(req, res),
  )
  .get('/:id', (req: Request, res: Response) => void retrieve(req, res))
  .get('/:id/accept', authenticateUser(), (req: Request, res: Response) => void accept(req, res));