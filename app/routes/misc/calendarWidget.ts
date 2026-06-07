import { Response, Request } from 'express';
import { db } from '../../database';
import { asyncRoute } from '../../helpers';
import { TenantControllerSet } from '../../controllers/tenant.controller';
import { GlobalTableNames, TenantParticipant, UserRole } from '../../types';

const getAppointmentsTableQuerySet = (tenantParticipant: TenantParticipant) => {
  switch (tenantParticipant.role) {
    case UserRole.PATIENT:
      return { patient_participant_id: tenantParticipant.id };
    case UserRole.DOCTOR:
      return { doctor_participant_id: tenantParticipant.id };
    case UserRole.CHIEF:
      return {};
    default:
      throw new Error('Unexpected role to access data for the patients');
  }
};

const buildDiseasesTableQuery = (tenant: TenantControllerSet, tenantParticipant: TenantParticipant) => {
  const { AppointmentController } = tenant;
  return AppointmentController.query()
    .where(getAppointmentsTableQuerySet(tenantParticipant))
    .join(
      `${tenant.tenant_participants_table} as participant`,
      `${tenant.tenant_appointments_table}.patient_participant_id`,
      'participant.id',
    )
    .join(
      `${GlobalTableNames.users} as user`,
      'participant.user_id',
      'user.id',
    )
    .select(
      `${tenant.tenant_appointments_table}.id`,
      `${tenant.tenant_appointments_table}.status`,
      `${tenant.tenant_appointments_table}.patient_participant_id`,
      `${tenant.tenant_appointments_table}.doctor_participant_id`,
      `${tenant.tenant_appointments_table}.scheduled_at`,
      `${tenant.tenant_appointments_table}.duration_minutes`,
      db.raw('"user"."first_name" || \' \' || "user"."last_name" as "patient_full_name"'),
    );
};

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, tenantParticipant } = req;

  const data = await buildDiseasesTableQuery(tenant, tenantParticipant);

  return res.json({ data });
});
