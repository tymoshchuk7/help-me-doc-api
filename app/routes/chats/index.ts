import { Request, Response, Router } from 'express';
import { Schema } from 'express-validator';
import {
  authenticateUser, loadTenant, validate,
  validateParams,
} from '../../middlewares';
import { Permissions } from '../../types';

import getAvailableContacts from './getAvailableContacts';
import post from './post';
import get from './get';
import retrieve from './retrieve';

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
    loadTenant([Permissions.CAN_SEND_MESSAGES]),
    (req: Request, res: Response) => void getAvailableContacts(req, res),
  )
  .post(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_SEND_MESSAGES]),
    ...validate(messageValidationSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_SEND_MESSAGES]),
    (req: Request, res: Response) => void get(req, res),
  )
  .get(
    '/:id',
    authenticateUser(),
    loadTenant([Permissions.CAN_SEND_MESSAGES]),
    ...validateParams(),
    (req: Request, res: Response) => void retrieve(req, res),
  );
