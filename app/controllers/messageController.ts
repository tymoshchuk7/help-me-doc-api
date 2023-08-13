import { TenantModel } from './AbstractTenantModel';
import { TenantMessage, TenantTableName } from '../types';

class MessageController extends TenantModel<TenantMessage> {

  tenantTableName: TenantTableName;

  constructor() {
    super();
    this.tenantTableName = 'tenant_messages_table';
  }

}

export default new MessageController();