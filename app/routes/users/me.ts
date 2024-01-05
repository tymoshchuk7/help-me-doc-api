import { Response, Request } from 'express';
import { asyncRoute, prepareAPIResponse } from '../../helpers';
import { ParticipantController, UserController } from '../../controllers';
import { ModelMeta } from '../../types';

export default asyncRoute( async (req: Request, res: Response) => {
  const { tenantParticipant } = req;
  const { user } = req;

  if (!tenantParticipant) {
    throw new Error('Participant is missing');
  }

  const tenantParticipants = await ParticipantController.find(user.defaultTenant, {});
  const users = await UserController.find({});

  return res.json({
    user,
    participants: prepareAPIResponse(tenantParticipants as ModelMeta[]),
    users: prepareAPIResponse(users as ModelMeta[]),
  });
});