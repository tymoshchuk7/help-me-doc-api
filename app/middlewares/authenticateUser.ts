import { Request, Response, NextFunction } from 'express';
import checkJWT from './checkJWT';
import { UserController } from '../controllers';
import { ApiException, NotFoundException } from '../exceptions';
import { AccessError } from '../types';

export default (): [
  (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
] => [
  checkJWT,
  async (
    request: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!request.auth) {
        return next(new ApiException({ message: 'Unauthorized', statusCode: 401 }));
      }
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
        return next(new NotFoundException({ message: 'User is malformed' }));
      }
      next();
    } catch (e) {
      const error = e as AccessError;
      error.statusCode = 500;
      next(error);
    }
  },
];
