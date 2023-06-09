import { Request, Response, NextFunction } from 'express';
import checkJWT from './checkJWT';
import { UserController } from '../controllers';
import { AccessError } from '../types';

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
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      email, meta_data: { first_name, last_name }, picture: avatar,
    } = request.auth;
    const user = await UserController.findOne({ email });

    if (!user) {
      request.user = await UserController.create({ email, first_name, last_name, avatar });
    } else {
      request.user = user;
    }

    if (!request.user) {
      return next(getError(404, 'User is malformed'));
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
