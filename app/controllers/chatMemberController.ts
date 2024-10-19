import { TenantModel } from './AbstractTenantModel';
import { TenantChatMember, TenantTableName } from '../types';

class ChatMemberController extends TenantModel<TenantChatMember> {

  tenantTableName: TenantTableName;

  constructor() {
    super();
    this.tenantTableName = 'tenant_chats_members_table';
  }

}

export default new ChatMemberController();