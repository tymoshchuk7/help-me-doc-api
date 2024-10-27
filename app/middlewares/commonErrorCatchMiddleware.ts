import { NextFunction, Request, Response } from 'express';
import { AccessError } from '../types';

export default function commonErrorCatchMiddleware(
  err: AccessError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.statusCode ?? 401).json({
    error: err.name,
    errorDescription: err.message,
  });
}