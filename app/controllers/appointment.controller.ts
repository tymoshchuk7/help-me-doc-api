import { TenantModel } from './abstract-tenant-model';
import { TenantAppointment, TenantTableName, Tenant } from '../types';
import { db } from '../database';

class AppointmentController extends TenantModel<TenantAppointment> {

  tenantTableName: TenantTableName;


  constructor(tenant: Tenant) {
    super(tenant);
    this.tenantTableName = 'tenant_appointments_table';
  }

  private async checkDoctorConflict(
    doctorId: string,
    scheduledAt: Date | string,
    durationMinutes: number,
    excludeId?: number,
  ): Promise<void> {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + durationMinutes * 60_000);

    let query = db<TenantAppointment>(this.tenant.tenant_appointments_table)
      .where('doctor_participant_id', doctorId)
      .whereNotIn('status', ['cancelled'])
      .where('scheduled_at', '<', end)
      .whereRaw('scheduled_at + (duration_minutes * interval \'1 minute\') > ?', [start]);

    if (excludeId !== undefined) {
      query = query.whereNot('id', excludeId);
    }

    const conflict = await query.first();
    if (conflict) {
      throw new Error('Doctor already has an appointment in this time slot');
    }
  }

  async create(dto: Omit<TenantAppointment, 'id'>): Promise<TenantAppointment> {
    const { doctor_participant_id, scheduled_at, duration_minutes } = dto;
    await this.checkDoctorConflict(doctor_participant_id, scheduled_at, duration_minutes);

    return super.create(dto);
  }

}

export default AppointmentController;