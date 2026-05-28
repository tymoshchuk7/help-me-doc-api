import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantAppointment } from '../../types';

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
    status: 'pending',
  });

  return res.json({ appointment });
});