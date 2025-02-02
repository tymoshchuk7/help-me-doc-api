import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { NotFoundException } from '../../exceptions';
import { InvitationController, UserController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user, tenant } = req;

  const invitation = await InvitationController.findOneById(id);

  if (!invitation) {
    throw new NotFoundException({ message: 'Invitation is missing' });
  }

  const { ParticipantController } = tenant;
  await ParticipantController.create({
    role: invitation.role,
    user_id: user.id,
  });
  await UserController.update({ id: user.id }, { default_tenant: invitation.tenant });

  return res.sendStatus(200);
});