import { Request, Response, Router } from 'express';
import { Schema } from 'express-validator';
import {
  authenticateUser, checkParticipantPermissions, validate,
} from '../../middlewares';
import { ROLE_PERMISSIONS } from '../../constants';
import { Permissions } from '../../types';

import post from './post';
import get from './get';
import retrieve from './retrieve';

const diseaseValidationSchema: Schema = {
  'data.name': {
    notEmpty: true,
    isLength: {
      options: { max: 150 },
    },
  },
  'data.description': {
    isLength: {
      options: { max: 2048 },
    },
  },
  'data.status': {
    notEmpty: true,
    isIn: { options: [['active', 'resolved', 'chronic']] },
  },
  'data.patient_participant_id': {
    notEmpty: true,
  },
  'data.treatment': {
    isLength: {
      options: { max: 2048 },
    },
  },
};

async function canSeeDisease(req: Request) {
  const { tenant, tenantParticipant } = req;
  if (!tenant) {
    throw new Error('Tenant is missing');
  }
  const { DiseaseController } = tenant;
  const disease = await DiseaseController.findOneById(req.params.id);
  if (!disease) {
    throw new Error('Disease is missing');
  }

  if (tenantParticipant.role === 'patient') {
    return disease.patient_participant_id === tenantParticipant.id;
  }

  return ROLE_PERMISSIONS[tenantParticipant.role].has(Permissions.CAN_VIEW_DISEASES);
}

export default Router()
  .post(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_CREATE_DISEASES]),
    ...validate(diseaseValidationSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .get(
    '/:id',
    authenticateUser(),
    checkParticipantPermissions(canSeeDisease),
    (req: Request, res: Response) => void retrieve(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_VIEW_DISEASES]),
    (req: Request, res: Response) => void get(req, res),
  );