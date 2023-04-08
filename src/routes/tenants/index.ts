import { Request, Response, Router } from 'express';
import { authorizeUser } from '../../middlewares';
import { AuthRequest } from '../../types';
import post from './post';

export default Router()
  .post('/', authorizeUser(), (req: Request, res: Response) => void post(req as unknown as AuthRequest, res));