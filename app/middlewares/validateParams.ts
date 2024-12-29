import { Request, Response, NextFunction } from 'express';
import {
  validationResult, ValidationChain, check,
} from 'express-validator';

/*
  There are only 'id' params across the app,
   so the middleware validates only id for the moment
  Use spread operator when calling the middleware, e. g.:
  post(
  '/',
  authenticateUser(),
  ...validateParams(),
  (req: Request, res: Response) => void post(req, res)),
*/

export default (): [ValidationChain, (req: Request, res: Response, next: NextFunction) => void] => [
  check(['id']).isUUID(4),
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    return res.status(400).json({ errors: result.array() });
  },
];