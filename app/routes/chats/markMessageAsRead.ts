import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { GlobalTableNames } from '../../types';

export default asyncRoute(async (req: Request, res: Response) => {
  const { tenant, params: { id } } = req;

  const { ChatMessageController } = tenant;

  await ChatMessageController.update({ id }, { is_read: true });

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

  return res.json({ messages });
});