import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { createTenant } from '../../database';
import { UserController, ParticipantController } from '../../controllers';

interface Body {
  data: { name: string },
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { user } = req;
  const { data: { name } } = req.body;

  if (user.default_tenant) {
    throw new Error('User already has related tenant');
  }

  const tenant = await createTenant(user.id, name);
  await UserController.update({ id: user.id }, { default_tenant: tenant.id });
  await ParticipantController.create(tenant.id, { role: 'chief', user_id: user.id });

  const updatedUser = await UserController.findUserJoiningParticipant(user.id);

  return res.json({ tenant, user: updatedUser });
});