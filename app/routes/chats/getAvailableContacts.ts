import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { ParticipantController, TenantController } from '../../controllers';
import { GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { user, tenantParticipant } = req;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const searchCondition = tenantParticipant.role === 'patient' ? { role: 'doctor' } : { role: 'patient' };

  const tenant = await TenantController.findOneById(user.default_tenant);
  if (!tenant) {
    throw new Error('Tenant is missing');
  }
  const queryObject = ParticipantController.query(tenant);

  const contacts = await queryObject
    .leftJoin(GlobalTableNames.users, `${tenant.tenant_participants_table}.user_id`, `${GlobalTableNames.users}.id`)
    .where(searchCondition)
    .select(
      `${tenant.tenant_participants_table}.id`,
      `${tenant.tenant_participants_table}.status`,
      `${tenant.tenant_participants_table}.role`,
      `${tenant.tenant_participants_table}.user_id`,
      `${GlobalTableNames.users}.first_name`,
      `${GlobalTableNames.users}.last_name`,
    );

  return res.json({ contacts });
});