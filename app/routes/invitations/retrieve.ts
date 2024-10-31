import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { InvitationController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { id } = req.params;

  const invitation = await InvitationController.findOneById(id);

  if (!invitation) {
    throw new Error('Invitation is missing');
  }

  return res.json({ invitation });
});