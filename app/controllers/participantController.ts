import { TenantModel } from './AbstractTenantModel';
import { TenantParticipant, TenantTableName } from '../types';

class ParticipantController extends TenantModel<TenantParticipant> {

  tenantTableName: TenantTableName;

  constructor() {
    super();
    this.tenantTableName = 'tenant_participants_table';
  }

}

export default new ParticipantController();