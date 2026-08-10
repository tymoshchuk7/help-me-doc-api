import { TenantModel } from './abstract-tenant-model';
import { TenantTableName, Tenant, TenantMedia } from '../types';

class TenantMediaController extends TenantModel<TenantMedia> {

  tenantTableName: TenantTableName;

  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_media_table';
  }

}

export default TenantMediaController;