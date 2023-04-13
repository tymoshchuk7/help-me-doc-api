import { Response } from 'express';
import { asyncRoute } from '../../helpers';
import { AuthRequest } from '../../types';
import { createTenant } from '../../database';
import { UserController, ParticipantController } from '../../controllers';

export default asyncRoute(async (req: AuthRequest, res: Response) => {
  const { user } = req;

  const tenant = await createTenant(user.id);

  if (!tenant) {
    throw new Error('Tenant has not being created');
  }
  await UserController.update({ id: user.id }, { defaultTenant: tenant.id });
  const participant = await ParticipantController.create(tenant.id, user.id, { role: 'doc', user_id: user.id });

  if (!participant) {
    throw new Error('Participant has not being created');
  }

  return res.json({ tenant });
});