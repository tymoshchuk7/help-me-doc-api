import { checkSchema, validationResult, Schema, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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