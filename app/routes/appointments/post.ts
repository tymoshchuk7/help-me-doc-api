import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantAppointment, TenantAppointmentStatus } from '../../types';

interface Body {
  data: Pick<TenantAppointment, 'scheduled_at' | 'patient_participant_id'>,
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { tenantParticipant, tenant, body: { data } } = req;
  const { patient_participant_id, scheduled_at } = data;

  const { AppointmentController } = tenant;

  const appointment = await AppointmentController.create({
    patient_participant_id,
    doctor_participant_id: tenantParticipant.id,
    scheduled_at,
    duration_minutes: 60,
    status: TenantAppointmentStatus.PENDING,
  });

  return res.json({ appointment });
});