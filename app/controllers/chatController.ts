import { TenantModel } from './AbstractTenantModel';
import { TenantChat, TenantTableName } from '../types';

class ChatController extends TenantModel<TenantChat> {

  tenantTableName: TenantTableName;

  constructor() {
    super();
    this.tenantTableName = 'tenant_chats_table';
  }

}

export default new ChatController();