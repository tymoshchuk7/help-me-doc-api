import { Request, Response, Router } from 'express';
import { authorizeUser } from '../../middlewares';

import get from './get';
import post from './post';

export default Router()
  .get('/', authorizeUser(), (req: Request, res: Response) => void get(req, res))
  .post('/', authorizeUser(), (req: Request, res: Response) => void post(req, res));
