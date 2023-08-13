import { Response, Request } from 'express';
import { asyncRoute, prepareAPIResponse } from '../../helpers';

export default asyncRoute( (req: Request, res: Response) => {
  const { tenantParticipant } = req;

  if (!tenantParticipant) {
    throw new Error('Participant is missing');
  }

  return res.json({
    user: req.user,
    participants: prepareAPIResponse(tenantParticipant),
  });
});