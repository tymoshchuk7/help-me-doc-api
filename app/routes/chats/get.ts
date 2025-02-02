import { Response, Request } from 'express';
import { map } from 'lodash';
import { asyncRoute } from '../../helpers';
import { NotFoundException } from '../../exceptions';
import { TenantChat, GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenantParticipant, tenant } = req;

  if (!tenantParticipant) {
    throw new NotFoundException({ message: 'Tenant participant is missing' });
  }

  const { ChatController, ChatMessageController } = tenant;

  const chatQueryObject = ChatController.query();
  const chats: TenantChat[] = await chatQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm1`, `${tenant.tenant_chats_table}.id`, 'tcm1.chat_id')
    .join(`${tenant.tenant_chats_members_table} as tcm2`, `${tenant.tenant_chats_table}.id`, 'tcm2.chat_id')
    .where('tcm1.participant_id', tenantParticipant.id)
    .andWhereRaw('tcm1.participant_id != tcm2.participant_id')
    .join(`${tenant.tenant_participants_table} as participant1`, 'tcm1.participant_id', 'participant1.id')
    .join(`${tenant.tenant_participants_table} as participant2`, 'tcm2.participant_id', 'participant2.id')
    .join(`${GlobalTableNames.users} as user1`, 'participant1.user_id', 'user1.id')
    .join(`${GlobalTableNames.users} as user2`, 'participant2.user_id', 'user2.id')
    .distinct(`${tenant.tenant_chats_table}.id`)
    .select(
      `${tenant.tenant_chats_table}.id`,
      'tcm1.participant_id as me_participant',
      'tcm2.participant_id as chat_partner_participant_id',
      'user2.first_name as chat_partner_first_name',
      'user2.last_name as chat_partner_last_name',
      'user2.avatar as chat_partner_avatar',
    );

  const messageQueryObject = ChatMessageController.query();
  const lastMessages = await messageQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm`, `${tenant.tenant_messages_table}.chat_member_id`, 'tcm.id')
    .join(`${tenant.tenant_participants_table} as tp`, 'tcm.participant_id', 'tp.id')
    .whereIn(`${tenant.tenant_messages_table}.chat_id`, map(chats, 'id'))
    .whereNot('tp.id', tenantParticipant.id)
    .where(`${tenant.tenant_messages_table}.is_read`, false)
    .select(
      `${tenant.tenant_messages_table}.id`,
      `${tenant.tenant_messages_table}.chat_id`,
      `${tenant.tenant_messages_table}.chat_member_id`,
      `${tenant.tenant_messages_table}.content`,
      `${tenant.tenant_messages_table}.is_read`,
      `${tenant.tenant_messages_table}.created_at`,
      'tp.id as participant_id',
    )
    .distinctOn(`${tenant.tenant_messages_table}.chat_id`)
  ;

  return res.json({ chats, lastMessages });
});