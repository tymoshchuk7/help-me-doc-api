import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant } = req;
  const { ParticipantController } = tenant;

  const participantsQueryObjects = ParticipantController.query();
  const participants = await participantsQueryObjects
    .join(`${GlobalTableNames.users} as user`, `${tenant.tenant_participants_table}.user_id`, 'user.id')
    .select(
      `${tenant.tenant_participants_table}.id`,
      `${tenant.tenant_participants_table}.role`,
      `${tenant.tenant_participants_table}.status`,
      `${tenant.tenant_participants_table}.user_id`,
      'user.first_name',
      'user.last_name',
    );


  return res.json({ participants });
});