import { Request, Response, Router } from 'express';
import { authenticateUser, checkParticipantPermissions } from '../../middlewares';
import { Permissions } from '../../types';

import get from './get';

export default Router()
  .get(
    '/',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_VIEW_PARTICIPANTS]),
    (req: Request, res: Response) => void get(req, res),
  );