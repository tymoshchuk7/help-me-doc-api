import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantChat } from '../../types';

interface Body {
  data: {
    participantRecipientId: string,
    content: string,
  }
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { tenantParticipant, tenant } = req;
  const { data: { participantRecipientId, content } } = req.body;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const {
    ChatController, ChatMessageController, ParticipantController,
    ChatMemberController,
  } = tenant;

  if (!tenant) {
    throw new Error('Tenant is missing');
  }
  const chatQueryObject = ChatController.query();

  const createdChatBefore: TenantChat = await chatQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm1`, `${tenant.tenant_chats_table}.id`, 'tcm1.chat_id')
    .join(`${tenant.tenant_chats_members_table} as tcm2`, `${tenant.tenant_chats_table}.id`, 'tcm2.chat_id')
    .where('tcm1.participant_id', tenantParticipant.id)
    .andWhere('tcm2.participant_id', participantRecipientId)
    .andWhereRaw('tcm1.participant_id != tcm2.participant_id')
    .select(`${tenant.tenant_chats_table}.id`)
    .first();

  const chat = createdChatBefore || (await ChatController.create({}));

  if (!chat) {
    throw new Error('Tenant chat is missing');
  }

  const senderChatMember = await ChatMemberController.create({
    participant_id: tenantParticipant.id,
    chat_id: chat.id,
  });

  const participantRecipient = await ParticipantController.findOneById(participantRecipientId);

  if (!participantRecipient) {
    throw new Error('Tenant recipient is missing');
  }

  await ChatMemberController.create({
    participant_id: participantRecipient.id,
    chat_id: chat.id,
  });

  await ChatMessageController.create({
    chat_id: chat.id,
    chat_member_id: senderChatMember?.id,
    content,
  });

  return res.json({ chat });
});