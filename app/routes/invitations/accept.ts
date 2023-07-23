import { Response, Request } from 'express';
import { asyncRoute, prepareAPIResponse } from '../../helpers';
import {
  InvitationController, ParticipantController, UserController,
} from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  const invitation = await InvitationController.findOneById(id);

  if (!invitation) {
    throw new Error('Invitation is missing');
  }

  const dto = {
    role: invitation.role,
    user_id: user.id,
  };

  const participant = await ParticipantController.create(invitation.tenant, user.id, dto);
  await UserController.update({ id: user.id }, { defaultTenant: invitation.tenant });

  if (!participant) {
    throw new Error('Participant is missing');
  }

  return res.json({
    participants: prepareAPIResponse(participant),
  });
});