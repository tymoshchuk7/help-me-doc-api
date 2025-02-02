import { Request, Response, NextFunction } from 'express';
import { TenantController } from '../controllers';
import { NotFoundException, ApiException } from '../exceptions';
import { ROLE_PERMISSIONS } from '../constants';
import { AccessError, Permissions } from '../types';

type CheckPermissionsCallback = (req: Request) => Promise<boolean> | boolean;

export default function loadTenant(permissions: Permissions[] | CheckPermissionsCallback) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new NotFoundException({ message: 'User is missing.' }));
      }

      const tenant = await TenantController.findOneById(req.user.default_tenant);
      if (!tenant) {
        return next(new NotFoundException({ message: 'Tenant is missing.' }));
      }
      req.tenant = tenant;

      const { ParticipantController } = tenant;
      const participant = await ParticipantController.findOne({ user_id: req.user.id });
      if (!participant) {
        return next(new NotFoundException({ message: 'Participant is missing.' }));
      }
      req.tenantParticipant = participant;

      if (Array.isArray(permissions)) {
        if (permissions.length === 0) {
          return next();
        }

        const hasPermissions = permissions.every((permission) => ROLE_PERMISSIONS[participant.role].has(permission));
        if (!hasPermissions) {
          return next(new ApiException({
            message: 'Access denied. You do not have the required permissions.',
            statusCode: 403,
          }));
        }
      } else {
        if (!(await permissions(req))) {
          return next(new ApiException({
            message: 'Access denied. You do not have the required permissions.',
            statusCode: 403,
          }));
        }
      }

      next();
    } catch (e) {
      const error = e as AccessError;
      error.statusCode = 500;
      next(error);
    }
  };
}