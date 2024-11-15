import { Request, Response, Router } from 'express';
import { Schema } from 'express-validator';
import {
  authenticateUser, checkParticipantPermissions, validate,
} from '../../middlewares';
import { Permissions } from '../../types';

import getAvailableContacts from './getAvailableContacts';
import post from './post';
import get from './get';

const messageValidationSchema: Schema = {
  'data.participantRecipientId': {
    errorMessage: 'Recipient is required',
    notEmpty: true,
    isLength: {
      options: { max: 36 },
    },
  },
  'data.content': {
    errorMessage: 'Recipient is required',
    notEmpty: true,
  },
};

export default Router()
  .get(
    '/contacts',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_SEND_MESSAGES]),
    (req: Request, res: Response) => void getAvailableContacts(req, res),
  )
  .post(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_SEND_MESSAGES]),
    ...validate(messageValidationSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_SEND_MESSAGES]),
    (req: Request, res: Response) => void get(req, res),
  );
