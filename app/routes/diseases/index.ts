import { Request, Response, Router } from 'express';
import {
  authenticateUser, loadTenant, validate,
  validateParams,
} from '../../middlewares';
import { diseaseValidation } from '../../validation';
import { NotFoundException } from '../../exceptions';
import { ROLE_PERMISSIONS } from '../../constants';
import { Permissions } from '../../types';

import post from './post';
import put from './put';
import get from './get';
import retrieve from './retrieve';



async function canSeeDisease(req: Request) {
  const { tenant, tenantParticipant } = req;
  if (!tenant) {
    throw new NotFoundException({ message: 'Tenant is missing' });
  }
  const { DiseaseController } = tenant;
  const disease = await DiseaseController.findOneById(req.params.id);
  if (!disease) {
    throw new NotFoundException({ message: 'Disease is missing' });
  }

  if (tenantParticipant.role === 'patient') {
    return disease.patient_participant_id === tenantParticipant.id;
  }

  return ROLE_PERMISSIONS[tenantParticipant.role].has(Permissions.CAN_VIEW_DISEASES);
}

async function canUpdateDisease(req: Request) {
  const { tenant, tenantParticipant } = req;
  if (!tenant) {
    throw new NotFoundException({ message: 'Tenant is missing' });
  }

  const { DiseaseController } = tenant;
  const disease = await DiseaseController.findOneById(req.params.id);
  if (!disease) {
    throw new NotFoundException({ message: 'Disease is missing' });
  }

  return disease.doctor_participant_id === tenantParticipant.id;
}

export default Router()
  .post(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_CREATE_DISEASES]),
    ...validate(diseaseValidation.createSchema),
    (req: Request, res: Response) => void post(req, res),
  )
  .put(
    '/:id',
    authenticateUser(),
    loadTenant(canUpdateDisease),
    ...validateParams(),
    ...validate(diseaseValidation.updateSchema),
    (req: Request, res: Response) => void put(req, res),
  )
  .get(
    '/:id',
    authenticateUser(),
    loadTenant(canSeeDisease),
    ...validateParams(),
    (req: Request, res: Response) => void retrieve(req, res),
  )
  .get(
    '/',
    authenticateUser(),
    loadTenant([Permissions.CAN_VIEW_DISEASES]),
    (req: Request, res: Response) => void get(req, res),
  );