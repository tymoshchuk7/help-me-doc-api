import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import checkJWT from './checkJWT';
import { db } from '../database';
import { AccessError, AuthRequest } from '../types';

const getError = (statusCode: number, errorText: string, errorCode?: string | null): AccessError => {
  const error = new Error(errorText) as AccessError;
  error.statusCode = statusCode;
  if (errorCode) {
    error.errorCode = errorCode;
  }
  return error;
};


export default (): [
  (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  (
    request: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
  (
  err: AccessError,
  req: Request,
  res: Response,
  next: NextFunction) => void,
] => [
  checkJWT,
  async (
    request: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = (request as unknown as AuthRequest).auth;

    const user = await db('users').where({ email });

    if (isEmpty(user)) {
      await db('users').insert({ email });
      (request as unknown as AuthRequest).user = (await db('users').where({ email }))[0];
    } else {
      (request as unknown as AuthRequest).user = user[0];
    }

    next();
  },
  (
    err: AccessError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.statusCode ?? 401).json({
      error: err.name,
      errorDescription: err.message,
    });
  },
];
