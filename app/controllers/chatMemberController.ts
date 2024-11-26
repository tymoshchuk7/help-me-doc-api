import { TenantModel } from './AbstractTenantModel';
import { TenantChatMember, TenantTableName, Tenant } from '../types';

class ChatMemberController extends TenantModel<TenantChatMember> {

  tenantTableName: TenantTableName;

  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_chats_members_table';
  }

}

export default ChatMemberController;