import { Request, Response, Router } from 'express';
import {
  authenticateUser, loadTenant, validate,
  validateParams,
} from '../../middlewares';
import { Permissions } from '../../types';
import { appointmentValidation } from '../../validation';

import post from './post';
import get from './get';
import put from './put';
import retrieve from './retrieve';

export default Router()
  .post(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_CREATE_DISEASES]),
    ...validate(appointmentValidation.createSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_VIEW_DISEASES]),
    (req: Request, res: Response) => void get(req, res),
  )
  .get(
    '/:id',
    authenticateUser(),
    loadTenant([Permissions.CAN_VIEW_DISEASES]),
    ...validateParams(),
    (req: Request, res: Response) => void retrieve(req, res),
  )
  .put(
    '/:id',
    authenticateUser(),
    loadTenant([Permissions.CAN_CREATE_DISEASES]),
    ...validateParams(),
    ...validate(appointmentValidation.updateSchema),
    (req: Request, res: Response) => void put(req, res),
  );
