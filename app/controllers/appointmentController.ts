import { TenantModel } from './AbstractTenantModel';
import { TenantAppointment, TenantTableName, Tenant } from '../types';

class AppointmentController extends TenantModel<TenantAppointment> {

  tenantTableName: TenantTableName;


  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_appointments_table';
  }

}

export default AppointmentController;