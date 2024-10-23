import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { createTenant } from '../../database';
import { UserController, ParticipantController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { user } = req;

  if (user.default_tenant) {
    throw new Error('User already has related tenant');
  }

  const tenant = await createTenant(user.id);
  if (!tenant) {
    throw new Error('Tenant has not been created');
  }

  await UserController.update({ id: user.id }, { default_tenant: tenant.id });
  const participant = await ParticipantController.create(tenant.id, { role: 'chief', user_id: user.id });

  if (!participant) {
    throw new Error('Participant has not been created');
  }

  const updatedUser = await UserController.findOneById(user.id);

  return res.json({ tenant, user: updatedUser });
});