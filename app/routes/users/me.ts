import { Response, Request } from 'express';
import { asyncRoute, prepareAPIResponse } from '../../helpers';
import { ParticipantController } from '../../controllers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { user } = req;

  const participant = await ParticipantController.findOne(user.defaultTenant, { user_id: user.id });

  if (!participant) {
    throw new Error('Participant is missing');
  }

  return res.json({
    user: req.user,
    participants: prepareAPIResponse(participant),
  });
});