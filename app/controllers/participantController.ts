import { db } from '../database';
import { Tenant, TenantParticipant, GlobalTableNames } from '../types';

const participantsColumns = ['id, user_id', 'role', 'status'];

class ParticipantController {
  async create(tenantId: string, userId: string, value = {}): Promise<TenantParticipant | undefined> {
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (tenant) {
      await db(tenant.tenant_participants_table).insert(value);
      const [participant]: TenantParticipant[] = await db(tenant.tenant_participants_table).where({ user_id: userId });
      return participant;
    }
  }

  async findOne(tenantId: string, condition: Partial<TenantParticipant>): Promise<TenantParticipant | undefined> {
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (tenant) {
      const [participant]: TenantParticipant[] = await db(tenant.tenant_participants_table)
        .where(condition as TenantParticipant);
      return participant;
    }
  }

  async findOneById(tenantId: string, id: string): Promise<TenantParticipant | undefined> {
    return this.findOne(tenantId, { id });
  }

  async update(
    tenantId: string, condition: Partial<TenantParticipant>, value: Partial<TenantParticipant>,
  ): Promise<TenantParticipant | undefined> {
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (tenant) {
      const [participant]: TenantParticipant[] = await db(tenant.tenant_participants_table)
        .update(value)
        .where(condition as TenantParticipant)
        .returning(participantsColumns);
      return participant;
    }
  }
}

export default new ParticipantController();