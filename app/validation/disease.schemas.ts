import { Schema } from 'express-validator';
import { TenantDiseaseStatus } from '../types';

const diseasesStatus = [...Object.values(TenantDiseaseStatus)];
const createDiseasesStatus = diseasesStatus.filter((i => i != TenantDiseaseStatus.ACTIVE));

const createSchema: Schema = {
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
    isIn: { options: [createDiseasesStatus] },
  },
  'data.treatment': {
    isLength: {
      options: { max: 2048 },
    },
  },
  'data.patient_participant_id': {
    notEmpty: true,
  },
};

const updateSchema: Schema = {
  'data.name': {
    optional: true,
    notEmpty: true,
    isLength: {
      options: { max: 150 },
    },
  },
  'data.description': {
    optional: true,
    isLength: {
      options: { max: 2048 },
    },
  },
  'data.status': {
    optional: true,
    notEmpty: true,
    isIn: { options: [diseasesStatus] },
  },
  'data.treatment': {
    optional: true,
    isLength: {
      options: { max: 2048 },
    },
  },
};

export default { createSchema, updateSchema };
