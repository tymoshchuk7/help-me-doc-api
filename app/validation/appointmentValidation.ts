import { Schema } from 'express-validator';

const createSchema: Schema = {
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
  'data.patient_participant_id': {
    notEmpty: true,
  },
};

const updateSchema: Schema = {
  'data.status': {
    optional: true,
    notEmpty: true,
    isIn: { options: [['pending', 'completed']] },
  },
};

export default { createSchema, updateSchema };
