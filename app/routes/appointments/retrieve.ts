import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { NotFoundException } from '../../exceptions';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant } = req;
  const { AppointmentController } = tenant;

  const appointment = await AppointmentController.findOneById(req.params.id);
  if (!appointment) {
    throw new NotFoundException({ message: 'Appointment is missing' });
  }

  return res.json({ appointment });
});