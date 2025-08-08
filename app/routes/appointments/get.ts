import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant } = req;

  const { AppointmentController } = tenant;
  const appointments = await AppointmentController.find({});

  return res.json({ appointments });
});
