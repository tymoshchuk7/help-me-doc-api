import { Router, Request, Response } from 'express';
import { authorizeUser } from '../../middlewares';
import { AuthRequest } from '../../types';
import get from './get';

export default Router()
  .get('/', authorizeUser(), (req: Request, res: Response) => get(req as unknown as AuthRequest, res));