import { TenantModel } from './AbstractTenantModel';
import { TenantChat, TenantTableName, Tenant } from '../types';

class ChatController extends TenantModel<TenantChat> {

  tenantTableName: TenantTableName;

  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_chats_table';
  }

}

export default ChatController;