import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenantParticipant, params: { id }, tenant } = req;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const { ChatController, ChatMessageController } = tenant;

  const chatQueryObject = ChatController.query();
  const chat = await chatQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm1`, `${tenant.tenant_chats_table}.id`, 'tcm1.chat_id')
    .join(`${tenant.tenant_chats_members_table} as tcm2`, `${tenant.tenant_chats_table}.id`, 'tcm2.chat_id')
    .where(`${tenant.tenant_chats_table}.id`, id)
    .where('tcm1.participant_id', tenantParticipant.id)
    .andWhereRaw('tcm1.participant_id != tcm2.participant_id')
    .join(`${tenant.tenant_participants_table} as participant1`, 'tcm1.participant_id', 'participant1.id')
    .join(`${tenant.tenant_participants_table} as participant2`, 'tcm2.participant_id', 'participant2.id')
    .join(`${GlobalTableNames.users} as user1`, 'participant1.user_id', 'user1.id')
    .join(`${GlobalTableNames.users} as user2`, 'participant2.user_id', 'user2.id')
    .select(
      `${tenant.tenant_chats_table}.id`,
      'tcm1.participant_id as me_participant_id',
      'tcm1.id as me_chat_member_id',
      'tcm2.participant_id as chat_partner_participant_id',
      'tcm2.id as chat_partner_chat_member_id',
      'user2.first_name as chat_partner_first_name',
      'user2.last_name as chat_partner_last_name',
      'user2.avatar as chat_partner_avatar',
    )
    .first();

  if (!chat) {
    throw new Error('Chat is missing');
  }

  const messageQueryObject = ChatMessageController.query();
  const messages = await messageQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm`, `${tenant.tenant_messages_table}.chat_member_id`, 'tcm.id')
    .join(`${tenant.tenant_participants_table} as tp`, 'tcm.participant_id', 'tp.id')
    .join(`${GlobalTableNames.users} as user`, 'tp.user_id', 'user.id')
    .where(`${tenant.tenant_messages_table}.chat_id`, id)
    .select(
      `${tenant.tenant_messages_table}.id`,
      `${tenant.tenant_messages_table}.chat_id`,
      `${tenant.tenant_messages_table}.chat_member_id`,
      `${tenant.tenant_messages_table}.content`,
      `${tenant.tenant_messages_table}.is_read`,
      'tp.id as participant_id',
      'user.id as user_id',
    )
    .orderBy(`${tenant.tenant_messages_table}.created_at`, 'asc');

  return res.json({ chat, messages });
});