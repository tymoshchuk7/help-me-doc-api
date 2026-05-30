import { Response, Request } from 'express';
import { pick } from 'lodash';
import { asyncRoute } from '../../helpers';
import { TenantAppointment } from '../../types';

interface Body {
  data: Pick<TenantAppointment, 'status'>,
}

interface Params {
  [key: string]: string,
}


export default asyncRoute(async (req: Request<Params, object, Body>, res: Response) => {
  const { tenant, params: { id }, body: { data } } = req;

  const { AppointmentController } = tenant;

  const appointment = await AppointmentController.update({ id }, {
    ...pick(data, ['status']),
  });

  return res.json({ appointment });
});