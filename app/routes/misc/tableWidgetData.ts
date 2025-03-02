import { Response, Request } from 'express';
import { db } from '../../database';
import { asyncRoute } from '../../helpers';
import { TenantControllerSet } from '../../controllers/tenantController';
import { GlobalTableNames, TenantParticipant } from '../../types';

const getDiseaseTableQuerySet = (tenantParticipant: TenantParticipant) => {
  switch (tenantParticipant.role) {
    case 'patient':
      return { patient_participant_id: tenantParticipant.id };
    case 'doctor':
      return { doctor_participant_id: tenantParticipant.id };
    case 'chief':
      return {};
    default:
      throw new Error('Unexpected role to access data for the patients');
  }
};

const buildParticipantsTableQuery = (tenant: TenantControllerSet) => {
  const { ParticipantController } = tenant;
  return ParticipantController.query()
    .where({})
    .join(
      `${GlobalTableNames.users} as user`,
      `${tenant.tenant_participants_table}.user_id`,
      'user.id',
    )
    .select(
      `${tenant.tenant_participants_table}.id`,
      `${tenant.tenant_participants_table}.user_id`,
      `${tenant.tenant_participants_table}.status`,
      `${tenant.tenant_participants_table}.role`,
      'user.email as email',
      'user.phone_number as phone_number',
      'user.avatar as avatar',
      db.raw('"user"."first_name" || \' \' || "user"."last_name" as "participant_full_name"'),
    );
};

const buildDiseasesTableQuery = (tenant: TenantControllerSet, tenantParticipant: TenantParticipant) => {
  const { DiseaseController } = tenant;
  return DiseaseController.query()
    .where(getDiseaseTableQuerySet(tenantParticipant))
    .join(
      `${tenant.tenant_participants_table} as participant`,
      `${tenant.tenant_diseases_table}.patient_participant_id`,
      'participant.id',
    )
    .join(
      `${GlobalTableNames.users} as user`,
      'participant.user_id',
      'user.id',
    )
    .select(
      `${tenant.tenant_diseases_table}.id`,
      `${tenant.tenant_diseases_table}.name`,
      `${tenant.tenant_diseases_table}.description`,
      `${tenant.tenant_diseases_table}.status`,
      `${tenant.tenant_diseases_table}.treatment`,
      db.raw('"user"."first_name" || \' \' || "user"."last_name" as "patient_full_name"'),
    );
};

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, tenantParticipant } = req;

  const shouldBuildQueryForParticipantsTable = tenantParticipant.role === 'admin';
  const tableWidgetData = shouldBuildQueryForParticipantsTable ? await buildParticipantsTableQuery(tenant)
    : await buildDiseasesTableQuery(tenant, tenantParticipant);

  return res.json({ tableWidgetData });
});
