import { Schema } from 'express-validator';

const signedUrlSchema: Schema = {
  'data.path': {
    errorMessage: 'Path is required',
    notEmpty: true,
  },
};

export default { signedUrlSchema };
