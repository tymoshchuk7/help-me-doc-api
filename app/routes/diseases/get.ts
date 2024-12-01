import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant } = req;
  const { DiseaseController } = tenant;

  const diseases = await DiseaseController.find({});

  return res.json({ diseases });
});