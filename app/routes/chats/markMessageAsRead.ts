import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { broadcastChatMessageUpdate } from '../../socketIOServer';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, params: { id } } = req;

  const { ChatMessageController, TenantMediaController } = tenant;
  await ChatMessageController.update({ id }, { is_read: true });
  const messages = await ChatMessageController.find({ id });
  const createdAttachments = await TenantMediaController.find({ message_id: id });

  const message = {
    ...messages[0],
    attachments: createdAttachments,
  };

  broadcastChatMessageUpdate(message);

  return res.json({ messages });
});