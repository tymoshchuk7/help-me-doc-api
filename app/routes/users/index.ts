import { Request, Response, Router } from 'express';
import { authorizeUser } from '../../middlewares';
import me from './me';

export default Router()
  .get('/', authorizeUser(), (req: Request, res: Response) => void me(req, res));