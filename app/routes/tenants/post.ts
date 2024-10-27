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
  if (!tenant) {
    throw new Error('Tenant has not been created');
  }

  await UserController.update({ id: user.id }, { default_tenant: tenant.id });
  const participant = await ParticipantController.create(tenant.id, { role: 'chief', user_id: user.id });

  if (!participant) {
    throw new Error('Participant has not been created');
  }

  const updatedUser = await UserController.findUserJoiningParticipant(user.id);

  return res.json({ tenant, user: updatedUser });
});