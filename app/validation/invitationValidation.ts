import { Schema } from 'express-validator';

const createSchema: Schema = {
  'data.email': { isEmail: true },
  'data.role': { isIn: { options: [['patient', 'doctor', 'admin']] } },
};

export default { createSchema };
