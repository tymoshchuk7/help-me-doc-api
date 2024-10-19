import { Model } from './AbstractModel';
import { GlobalTableNames, Tenant } from '../types';

class TenantController extends Model<Tenant> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.tenants;
    this.columns = [
      'id',
      'user_id',
      'tenant_name',
      'tenant_participants_table',
      'tenant_chats_table',
      'tenant_messages_table',
      'tenant_chats_members_table',
      'tenant_media_table',
    ];
  }

}

export default new TenantController();