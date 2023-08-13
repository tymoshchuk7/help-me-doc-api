import { db } from '../database';
import {
  Tenant, GlobalTableNames, ModelMeta, TenantTableName,
} from '../types';

export abstract class TenantModel<T extends ModelMeta> {

  abstract tenantTableName: TenantTableName;

  async create(tenantId: string, value: Partial<T>): Promise<T | undefined> {
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (!tenant) {
      throw new Error('Tenant is missing');
    }
    const tableName = tenant[this.tenantTableName];
    //TODO test and refactor later
    //@ts-ignore
    const [created]: T[] = await db(tableName).insert(value).returning('id');
    const [result]: T[] = await db(tableName).where({ id: created.id });
    return result;
  }

  async find(tenantId: string, condition: Partial<T>) {
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (!tenant) {
      throw new Error('Tenant is missing');
    }
    const tableName = tenant[this.tenantTableName];
    return db(tableName).where(condition);
  }

  async findOne(tenantId: string, condition: Partial<T>): Promise<T | undefined> {
    if (!this.tenantTableName) {
      throw new Error('Tenant table name is missing');
    }
    const [result]: T[] = await this.find(tenantId, condition);
    return result;
  }

  async findOneById(tenantId: string, id: string): Promise<T | undefined> {
    return this.findOne(tenantId, { id } as Partial<T>);
  }

  async update(tenantId: string, condition: Partial<T>, value: Partial<T>): Promise<number | undefined> {
    if (!this.tenantTableName) {
      throw new Error('Tenant table name is missing');
    }
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (!tenant) {
      throw new Error('Tenant is missing');
    }
    const tableName = tenant[this.tenantTableName];
    return db(tableName).where(condition).update(value);
  }

  async delete(tenantId: string, condition: Partial<T>): Promise<number | undefined> {
    if (!this.tenantTableName) {
      throw new Error('Tenant table name is missing');
    }
    const [tenant] = await db<Tenant>(GlobalTableNames.tenants).where({ id: tenantId });
    if (!tenant) {
      throw new Error('Tenant is missing');
    }
    const tableName = tenant[this.tenantTableName];
    return db(tableName).where(condition).del();
  }
}
