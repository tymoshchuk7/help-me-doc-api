import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantDisease } from '../../types';

interface Body {
  data: Pick<TenantDisease, 'name' | 'description' | 'patient_participant_id' | 'treatment' | 'status'>,
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { tenantParticipant } = req;
  const { tenant } = req;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { data: { name, description, status, treatment, patient_participant_id } } = req.body;

  const { DiseaseController } = tenant;

  const disease = await DiseaseController.create({
    name,
    description,
    status,
    treatment,
    patient_participant_id,
    doctor_participant_id: tenantParticipant.id,
  });

  return res.json({ disease });
});