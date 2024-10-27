import { Response, Router, Request } from 'express';
import { Schema } from 'express-validator';
import { authenticateUser, validate } from '../../middlewares';
import post from './post';

const tenantValidationSchema: Schema = {
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

export default Router()
  .post('/', authenticateUser(), ...validate(tenantValidationSchema), (req: Request, res: Response) => void post(req, res));