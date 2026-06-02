import { Schema } from 'express-validator';
import { TenantAppointmentStatus } from '../types';

const createSchema: Schema = {
  'data.scheduled_at': {
    notEmpty: true,
    isLength: {
      options: { max: 150 },
    },
  },
  'data.patient_participant_id': {
    notEmpty: true,
  },
};

const updateSchema: Schema = {
  'data.status': {
    optional: true,
    notEmpty: true,
    isIn: { options: [[...Object.values(TenantAppointmentStatus)] ] },
  },
};

export default { createSchema, updateSchema };
