import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { ApiException } from '../../exceptions';
import { UserController, TenantController } from '../../controllers';
import { UserRole } from '../../types';

interface Body {
  data: { name: string },
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { user } = req;
  const { data: { name } } = req.body;

  if (user.default_tenant) {
    throw new ApiException({ message: 'User already has related tenant' });
  }

  const tenant = await TenantController.create({ name, user_id: user.id });
  if (!tenant) {
    throw new ApiException({ message: 'Tenant has not been created' });
  }

  const { ParticipantController } = tenant;
  await UserController.update({ id: user.id }, { default_tenant: tenant.id });
  await ParticipantController.create({ role: UserRole.CHIEF, user_id: user.id });

  const updatedUser = await UserController.findUserJoiningParticipant(user.id);

  return res.json({ tenant, user: updatedUser });
});