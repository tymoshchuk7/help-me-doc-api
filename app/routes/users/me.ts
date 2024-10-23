import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';

export default asyncRoute( (req: Request, res: Response) => {
  const { user } = req;

  return res.json({
    user,
  });
});