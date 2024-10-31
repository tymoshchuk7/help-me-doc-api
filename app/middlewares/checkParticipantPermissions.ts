import { Request, Response, NextFunction } from 'express';
import { ParticipantController } from '../controllers';
import { ApiError } from '../utils';
import { ROLE_PERMISSIONS } from '../constants';
import { AccessError, Permissions } from '../types';

export default function checkParticipantPermissions(permissions: Permissions[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (permissions.length === 0) {
        return next();
      }

      if (!req.user) {
        return next(new ApiError({ message: 'User is missing.', statusCode: 404 }));
      }

      const participant = await ParticipantController.findOne(req.user.default_tenant, { user_id: req.user.id });
      if (!participant) {
        return next(new ApiError({ message: 'Participant is missing.', statusCode: 404 }));
      }

      const hasPermissions = permissions.every((permission) => ROLE_PERMISSIONS[participant.role].has(permission));
      if (!hasPermissions) {
        return next(new ApiError({
          message: 'Access denied. You do not have the required permissions.',
          statusCode: 403,
        }));
      }

      next();
    } catch (e) {
      const error = e as AccessError;
      error.statusCode = 500;
      next(error);
    }
  };
}