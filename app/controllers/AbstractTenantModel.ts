import { db } from '../database';
import {
  Tenant, ModelMeta, TenantTableName,
} from '../types';

export abstract class TenantModel<T extends ModelMeta> {

  abstract tenantTableName: TenantTableName;

  tenant: Tenant;

  constructor(tenant: Tenant) {
    this.tenant = tenant;
  }

  async create(value: Partial<T>): Promise<T> {
    const tableName = this.tenant[this.tenantTableName];
    //TODO test and refactor later
    //@ts-ignore
    const [created]: T[] = await db(tableName).insert(value).returning('id');
    const [result]: T[] = await db(tableName).where({ id: created.id });
    return result;
  }

  async find(condition: Partial<T>) {
    const tableName = this.tenant[this.tenantTableName];
    return db(tableName).where(condition);
  }

  async findOne(condition: Partial<T>): Promise<T | undefined> {
    const [result]: T[] = await this.find(condition);
    return result;
  }

  async findOneById(id: string): Promise<T | undefined> {
    return this.findOne({ id } as Partial<T>);
  }

  async update(condition: Partial<T>, value: Partial<T>): Promise<number | undefined> {
    const tableName = this.tenant[this.tenantTableName];
    return db(tableName).where(condition).update(value);
  }

  async delete(tenantId: string, condition: Partial<T>): Promise<number | undefined> {
    const tableName = this.tenant[this.tenantTableName];
    return db(tableName).where(condition).del();
  }

  /*
    query method necessary should be not async
    https://stackoverflow.com/questions/65319822/how-does-knex-await-execute-a-database-query
  */
  query() {
    const tableName = this.tenant[this.tenantTableName];
    return db(tableName);
  }
}
