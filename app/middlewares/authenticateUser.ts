import { Request, Response, NextFunction } from 'express';
import checkJWT from './checkJWT';
import { UserController } from '../controllers';
import { AccessError } from '../types';
import commonErrorCatchMiddleware from './commonErrorCatchMiddleware';

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
    try {
      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        email, meta_data: { first_name, last_name }, picture: avatar,
      } = request.auth;
      const user = await UserController.findOne({ email });

      if (user) {
        request.user = user;
      } else {
        request.user = await UserController.create({ email, first_name, last_name, avatar });
      }

      if (!request.user) {
        return next(getError(404, 'User is malformed'));
      }
      next();
    } catch (e) {
      const error = e as AccessError;
      error.statusCode = 500;
      next(error);
    }
  },
  commonErrorCatchMiddleware,
];
