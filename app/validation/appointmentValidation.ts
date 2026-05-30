import { Schema } from 'express-validator';

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
    isIn: { options: [['pending', 'completed']] },
  },
};

export default { createSchema, updateSchema };
