import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import {
  ChatController, ChatMemberController, ParticipantController,
} from '../../controllers';

interface Body {
  participantRecipientId: string
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { user, tenantParticipant } = req;
  const { participantRecipientId } = req.body;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const chat = await ChatController.create(user.defaultTenant, {});

  if (!chat) {
    throw new Error('Tenant chat is missing');
  }

  await ChatMemberController.create(
    user.defaultTenant,
    {
      participant_id: tenantParticipant.id,
      chat_id: chat.id,
      user_id: user.id,
    },
  );

  const participantRecipient = await ParticipantController.findOneById(user.defaultTenant, participantRecipientId);

  if (!participantRecipient) {
    throw new Error('Tenant recipient is missing');
  }

  await ChatMemberController.create(
    user.defaultTenant,
    {
      participant_id: participantRecipient.id,
      chat_id: chat.id,
      user_id: participantRecipient.user_id,
    },
  );

  return res.json({ chatId: chat.id });
});