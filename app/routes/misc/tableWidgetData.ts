import { Response, Request } from 'express';
import { db } from '../../database';
import { asyncRoute } from '../../helpers';
import { GlobalTableNames, TenantParticipant } from '../../types';

const getDiseaseTableQuerySet = (tenantParticipant: TenantParticipant) => {
  const queries = {
    'patient': { patient_participant_id: tenantParticipant.id },
    'doctor': { doctor_participant_id: tenantParticipant.id },
    'chief': {},
    'admin': {},
  };
  return queries[tenantParticipant.role];
};

export default asyncRoute( async (req: Request, res: Response) => {
  const { tenant, tenantParticipant } = req;
  const { DiseaseController, ParticipantController } = tenant;
  const participantsQueryObject = ParticipantController.query();
  const diseasesQueryObject = DiseaseController.query();

  const collectDataForParticipantsTable = tenantParticipant.role === 'admin';

  const tableWidgetData = collectDataForParticipantsTable ? await participantsQueryObject
    .where({})
    .join(`${GlobalTableNames.users} as user`, `${tenant.tenant_participants_table}.user_id`, 'user.id')
    .select(
      `${tenant.tenant_participants_table}.id`,
      `${tenant.tenant_participants_table}.user_id`,
      `${tenant.tenant_participants_table}.status`,
      `${tenant.tenant_participants_table}.role`,
      'user.email as email',
      'user.phone_number as phone_number',
      'user.avatar as avatar',
      db.raw('"user"."first_name" || \' \' || "user"."last_name" as "participant_full_name"'),
    ) : await diseasesQueryObject
    .where(getDiseaseTableQuerySet(tenantParticipant))
    .join(
      `${tenant.tenant_participants_table} as participant`,
      `${tenant.tenant_diseases_table}.patient_participant_id`,
      'participant.id',
    )
    .join(`${GlobalTableNames.users} as user`, 'participant.user_id', 'user.id')
    .select(
      `${tenant.tenant_diseases_table}.id`,
      `${tenant.tenant_diseases_table}.name`,
      `${tenant.tenant_diseases_table}.description`,
      `${tenant.tenant_diseases_table}.status`,
      `${tenant.tenant_diseases_table}.treatment`,
      db.raw('"user"."first_name" || \' \' || "user"."last_name" as "patient_full_name"'),
    );

  return res.json({ tableWidgetData });
});