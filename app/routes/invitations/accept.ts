import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
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

  await ParticipantController.create(invitation.tenant, dto);
  await UserController.update({ id: user.id }, { default_tenant: invitation.tenant });

  return res.sendStatus(200);
});