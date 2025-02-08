import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, params: { id } } = req;

  const { ChatMessageController } = tenant;
  await ChatMessageController.update({ id }, { is_read: true });
  const messages = await ChatMessageController.find({ id });

  return res.json({ messages });
});