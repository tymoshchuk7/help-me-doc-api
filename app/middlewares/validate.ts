import { Request, Response, NextFunction } from 'express';
import {
  checkSchema, validationResult, Schema,
  ValidationChain,
} from 'express-validator';

/*
  Use spread operator when calling validate middleware, e. g.:
  post(
  '/',
  authenticateUser(),
  ...validate(tenantValidationSchema),
  (req: Request, res: Response) => void post(req, res)),
*/

export default (schema: Schema): [ValidationChain[], (req: Request, res: Response, next: NextFunction) => void] => [
  checkSchema(schema, ['body']),
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    return res.status(400).json({ errors: result.array() });
  },
];