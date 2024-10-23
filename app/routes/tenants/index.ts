import { Response, Router, Request } from 'express';
import { checkSchema } from 'express-validator';
import { authorizeUser } from '../../middlewares';
import post from './post';

const validateTenant = () => checkSchema({
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
});

export default Router()
  .post('/', authorizeUser({}), validateTenant(), (req: Request, res: Response) => void post(req, res));