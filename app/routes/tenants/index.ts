import { Response, Router, Request } from 'express';
import { authenticateUser, validate } from '../../middlewares';
import { tenantValidation } from '../../validation';
import post from './post';

export default Router()
  .post(
    '/',
    authenticateUser(),
    ...validate(tenantValidation.createSchema),
    (req: Request, res: Response) => void post(req, res),
  );
