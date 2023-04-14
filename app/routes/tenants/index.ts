import { Response, Router, Request } from 'express';
import { authorizeUser } from '../../middlewares';
import post from './post';

export default Router()
  .post('/', authorizeUser(), (req: Request, res: Response) => void post(req, res));