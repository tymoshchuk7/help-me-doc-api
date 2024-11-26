import { TenantModel } from './AbstractTenantModel';
import { Tenant, TenantParticipant, TenantTableName } from '../types';

class ParticipantController extends TenantModel<TenantParticipant> {

  tenantTableName: TenantTableName;

  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_participants_table';
  }

}

export default ParticipantController;