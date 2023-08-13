import { db } from '../database';
import { GlobalTableNames, ModelMeta } from '../types';

export abstract class Model<T extends ModelMeta> {

  abstract tableName: GlobalTableNames;

  abstract columns: string[];

  async create(value: Partial<T>): Promise<T> {
    const [result] = await db(this.tableName)
      .insert(value)
      .returning(this.columns);
    return result as T;
  }

  async find(condition: Partial<T>): Promise<T[]> {
    return db(this.tableName).where(condition);
  }

  async findOne(condition: Partial<T>): Promise<T | undefined> {
    const [result] = await this.find(condition);
    return result;
  }

  async findOneById(id: string): Promise<T | undefined> {
    return this.findOne({ id } as T);
  }

  async update(condition: Partial<T>, value: Partial<T>): Promise<number> {
    return db(this.tableName).where(condition).update(value);
  }

  async delete(condition: T): Promise<void> {
    return db(this.tableName).where(condition).del();
  }
}
