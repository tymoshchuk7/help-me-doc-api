import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenantParticipant, tenant } = req;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const { ParticipantController } = tenant;
  const searchCondition = tenantParticipant.role === 'patient' ? { role: 'doctor' } : { role: 'patient' };

  const queryObject = ParticipantController.query();

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