import { Response } from 'express';
import { asyncRoute } from '../../helpers';
import { AuthRequest } from '../../types';
import { createTenant } from '../../database';

export default asyncRoute(async (req: AuthRequest, res: Response) => {
  const { user } = req;

  const tenant = await createTenant(user.id);

  if (!tenant) {
    throw new Error('Tenant has not being created');
  }

  return res.json({ tenant: tenant });
});