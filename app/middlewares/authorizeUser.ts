import { Request, Response, NextFunction } from 'express';
import authenticateUser from './authenticateUser';
import { UserController, ParticipantController } from '../controllers';
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

export default ({ permissions }: { permissions?: string[] }): [
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
  authenticateUser,
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

      if (permissions) {
        request.tenantParticipant = (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await ParticipantController.findOne(request.user.default_tenant, { user_id: user?.id })
        ) ?? null;
        //TODO add permission check logic
      }

      next();
    } catch (e) {
      next(e);
    }
  },
  commonErrorCatchMiddleware,
];
