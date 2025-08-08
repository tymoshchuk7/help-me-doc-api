import { Request, Response, Router } from 'express';
import { Schema } from 'express-validator';
import {
  authenticateUser, loadTenant, validate,
  validateParams,
} from '../../middlewares';
import { Permissions } from '../../types';

import post from './post';
import get from './get';
import put from './put';
import retrieve from './retrieve';

const patientRequiredValidation: Schema = {
  'data.patient_participant_id': {
    notEmpty: true,
  },
};

const appointmentValidationSchema: Schema = {
  'data.starting_date': {
    notEmpty: true,
    isLength: {
      options: { max: 150 },
    },
  },
  'data.ending_date': {
    notEmpty: true,
    isLength: {
      options: { max: 2048 },
    },
  },
};

export default Router()
  .post(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_CREATE_DISEASES]),
    ...validate({ ...appointmentValidationSchema, ...patientRequiredValidation }),
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
    (req: Request, res: Response) => void put(req, res),
  );
