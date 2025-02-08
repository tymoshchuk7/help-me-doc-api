import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { NotFoundException } from '../../exceptions';
import { sendNewMessageNotification } from '../../socketIOServer';
import { TenantChat } from '../../types';

interface Body {
  data: {
    participantRecipientId: string,
    content: string,
  }
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { tenantParticipant, tenant, user } = req;
  const { data: { participantRecipientId, content } } = req.body;

  if (!tenantParticipant) {
    throw new NotFoundException({ message: 'Tenant participant is missing' });
  }

  const {
    ChatController, ChatMessageController, ParticipantController,
    ChatMemberController,
  } = tenant;

  if (!tenant) {
    throw new NotFoundException({ message: 'Tenant is missing' });
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
    throw new NotFoundException({ message: 'Tenant chat is missing' });
  }

  const senderChatMember = await (createdChatBefore ? ChatMemberController.findOne({
    participant_id: tenantParticipant.id,
    chat_id: chat.id,
  }) : ChatMemberController.create({
    participant_id: tenantParticipant.id,
    chat_id: chat.id,
  }));

  if (!senderChatMember) {
    throw new NotFoundException({ message: 'Tenant sender chat participant is missing' });
  }

  const participantRecipient = await ParticipantController.findOneById(participantRecipientId);

  if (!participantRecipient) {
    throw new NotFoundException({ message: 'Tenant recipient is missing' });
  }

  if (!createdChatBefore) {
    await ChatMemberController.create({
      participant_id: participantRecipient.id,
      chat_id: chat.id,
    });
  }

  const message = await ChatMessageController.create({
    chat_id: chat.id,
    chat_member_id: senderChatMember?.id,
    content,
  });

  sendNewMessageNotification({
    recipientParticipantId: participantRecipient.id,
    userSender: user,
    messageId: message.id,
    chatId: chat.id,
  });

  return res.json({ chat });
});