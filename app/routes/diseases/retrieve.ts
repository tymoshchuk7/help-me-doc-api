import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant } = req;
  const { DiseaseController } = tenant;

  const disease = await DiseaseController.findOneById(req.params.id);
  if (!disease) {
    throw new Error('Disease is missing');
  }

  return res.json({ disease });
});