import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { NotFoundException } from '../../exceptions';
import { InvitationController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { id } = req.params;

  const invitation = await InvitationController.findOneById(id);

  if (!invitation) {
    throw new NotFoundException({ message: 'Invitation is missing' });
  }

  return res.json({ invitation });
});