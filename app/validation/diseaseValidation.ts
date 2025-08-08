import { Schema } from 'express-validator';

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
    isIn: { options: [['active', 'chronic']] },
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
    isIn: { options: [['active', 'resolved', 'chronic']] },
  },
  'data.treatment': {
    optional: true,
    isLength: {
      options: { max: 2048 },
    },
  },
};

export default { createSchema, updateSchema };
