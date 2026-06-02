import { Schema } from 'express-validator';

const createSchema: Schema = {
  'data.name': {
    errorMessage: 'Tenant name is invalid',
    notEmpty: true,
    isLength: {
      options: { max: 150 },
    },
    matches: {
      options: /^[a-zA-Z0-9.,/ ]+$/,
    },
  },
};

export default { createSchema };
