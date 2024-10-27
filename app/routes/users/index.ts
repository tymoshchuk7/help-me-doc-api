import { Request, Response, Router } from 'express';
import { authenticateUser } from '../../middlewares';
import me from './me';

export default Router()
  .get('/me', authenticateUser(), (req: Request, res: Response) => void me(req, res));