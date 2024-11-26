import { TenantModel } from './AbstractTenantModel';
import { Tenant, TenantMessage, TenantTableName } from '../types';

class MessageController extends TenantModel<TenantMessage> {

  tenantTableName: TenantTableName;

  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_messages_table';
  }

}

export default MessageController;