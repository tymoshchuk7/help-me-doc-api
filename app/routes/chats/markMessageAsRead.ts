import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { broadcastChatMessageUpdate } from '../../socketIOServer';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, params: { id } } = req;

  const { ChatMessageController } = tenant;
  await ChatMessageController.update({ id }, { is_read: true });
  const messages = await ChatMessageController.find({ id });

  broadcastChatMessageUpdate(messages[0]);

  return res.json({ messages });
});