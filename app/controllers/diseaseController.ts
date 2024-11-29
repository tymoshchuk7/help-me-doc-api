import { TenantModel } from './AbstractTenantModel';
import { TenantDisease, TenantTableName, Tenant } from '../types';

class DiseaseController extends TenantModel<TenantDisease> {

  tenantTableName: TenantTableName;


  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_diseases_table';
  }

}

export default DiseaseController;