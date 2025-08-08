import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantAppointment } from '../../types';

interface Body {
  data: Pick<TenantAppointment, 'starting_date' | 'ending_date'  | 'patient_participant_id'>,
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { tenantParticipant, tenant, body: { data } } = req;
  const { patient_participant_id, starting_date, ending_date } = data;

  const { AppointmentController } = tenant;
  const appointment = await AppointmentController.create({
    patient_participant_id,
    doctor_participant_id: tenantParticipant.id,
    starting_date,
    ending_date,
    status: 'pending',
  });

  return res.json({ appointment });
});