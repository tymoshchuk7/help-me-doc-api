import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { InvitationController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const user = req.user;

  const invitations = await InvitationController.find({ tenant: user.default_tenant });

  return res.json({ invitations });
});