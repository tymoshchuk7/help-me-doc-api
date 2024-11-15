import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantController, ChatController } from '../../controllers';
import { TenantChat, GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { user, tenantParticipant } = req;

  if (!tenantParticipant) {
    throw new Error('Tenant participant is missing');
  }

  const tenant = await TenantController.findOneById(user.default_tenant);
  if (!tenant) {
    throw new Error('Tenant is missing');
  }

  const chatQueryObject = ChatController.query(tenant);
  const chats: TenantChat = await chatQueryObject
    .join(`${tenant.tenant_chats_members_table} as tcm1`, `${tenant.tenant_chats_table}.id`, 'tcm1.chat_id')
    .join(`${tenant.tenant_chats_members_table} as tcm2`, `${tenant.tenant_chats_table}.id`, 'tcm2.chat_id')
    .where('tcm1.participant_id', tenantParticipant.id)
    .andWhereRaw('tcm1.participant_id != tcm2.participant_id')
    .join(`${tenant.tenant_participants_table} as participant1`, 'tcm1.participant_id', 'participant1.id')
    .join(`${tenant.tenant_participants_table} as participant2`, 'tcm2.participant_id', 'participant2.id')
    .join(`${GlobalTableNames.users} as user1`, 'participant1.user_id', 'user1.id')
    .join(`${GlobalTableNames.users} as user2`, 'participant2.user_id', 'user2.id')
    .select(
      `${tenant.tenant_chats_table}.id`,
      'tcm1.participant_id as me_participant',
      'tcm2.participant_id as chat_partner_participant_id',
      'user2.first_name as chat_partner_first_name',
      'user2.last_name as chat_partner_last_name',
      'user2.avatar as chat_partner_avatar',
    );

  return res.json({ chats });
});