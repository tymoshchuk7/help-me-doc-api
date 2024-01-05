import { Response, Request } from 'express';
import { map } from 'lodash';
import { db } from '../../database';
import { asyncRoute, prepareAPIResponse } from '../../helpers';
import { TenantController } from '../../controllers';
import { ModelMeta, TenantChatMember } from '../../types';

type ChatRecord = Record<string, {
  id: string,
  me?: string,
  otherParticipant?: string,
}>;

export default asyncRoute(async (req: Request, res: Response) => {
  const { user, tenantParticipant } = req;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const tenant = await TenantController.findOneById(user.defaultTenant);

  if (!tenant) {
    throw new Error('Tenant is missing');
  }

  const participantChats: ModelMeta[] = await db
    .from(tenant.tenant_chats_members_table)
    .where({ 'participant_id': tenantParticipant.id });

  const participantChatsIncludingInterlocutor: TenantChatMember[] = await db
    .from(`${tenant.tenant_chats_table} AS chat`)
    .join(
      `${tenant.tenant_chats_members_table} AS chat_member`,
      'chat_member.chat_id',
      'chat.id',
    )
    .where('chat_id', 'IN', map(participantChats, 'chat_id'));

  const chats = participantChatsIncludingInterlocutor.reduce<ChatRecord>((acc, currentValue) => {
    const chatId = currentValue.chat_id;
    if (!acc[chatId]) {
      acc[chatId] = {
        id: chatId,
      };
    }

    const key = currentValue.participant_id === tenantParticipant.id ? 'me' : 'otherParticipant';
    acc[chatId][key] = currentValue.participant_id;

    return acc;
  }, {});

  const chatParticipants = await db
    .from(tenant.tenant_participants_table)
    .where('id', 'IN', map(participantChatsIncludingInterlocutor, 'participant_id'));

  const chatUsers = await db
    .from('users')
    .where('id', 'IN', map(chatParticipants, 'user_id'));

  return res.json({
    chats,
    participants: prepareAPIResponse(chatParticipants),
    users: prepareAPIResponse(chatUsers),
  });
});