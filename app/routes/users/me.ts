import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { UserController } from '../../controllers';

export default asyncRoute( async (req: Request, res: Response) => {
  const { user } = req;

  const me = user.default_tenant ? await UserController.findUserJoiningParticipant(user.id) : user;

  return res.json({ user: me });
});