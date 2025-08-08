import { Request, Response, Router } from 'express';
import {
  authenticateUser, loadTenant, validate,
  validateParams,
} from '../../middlewares';
import { Permissions } from '../../types';
import { messageValidation } from '../../validation';

import getAvailableContacts from './getAvailableContacts';
import post from './post';
import get from './get';
import retrieve from './retrieve';
import markMessageAsRead from './markMessageAsRead';

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
    ...validate(messageValidation.createSchema),
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
  )
  .put(
    '/:id',
    authenticateUser(),
    loadTenant([Permissions.CAN_SEND_MESSAGES]),
    ...validateParams(),
    (req: Request, res: Response) => void markMessageAsRead(req, res),
  );
