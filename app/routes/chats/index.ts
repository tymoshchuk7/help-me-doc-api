import { Request, Response, Router } from 'express';
import { authenticateUser, checkParticipantPermissions } from '../../middlewares';
import { Permissions } from '../../types';

import getAvailableContacts from './getAvailableContacts';

export default Router()
  .get(
    '/contacts',
    authenticateUser(),
    checkParticipantPermissions([Permissions.CAN_SEND_MESSAGES]),
    (req: Request, res: Response) => void getAvailableContacts(req, res),
  );
