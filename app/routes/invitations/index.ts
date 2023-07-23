import { Request, Response, Router } from 'express';
import { authorizeUser } from '../../middlewares';

import post from './post';
import get from './get';
import accept from './accept';

export default Router()
  .post('/', authorizeUser(), (req: Request, res: Response) => void post(req, res))
  .get('/:id', (req: Request, res: Response) => void get(req, res))
  .get('/:id/accept', authorizeUser(), (req: Request, res: Response) => void accept(req, res));
