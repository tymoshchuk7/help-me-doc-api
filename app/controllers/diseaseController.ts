import { db } from '../database';
import { Disease, GlobalTableNames } from '../types';

const diseaseColumns = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'defaultTenant', 'avatar'];

class DiseaseController {
  async create(value: Partial<Disease>): Promise<Disease> {
    const [disease]: Disease[] = await db<Disease>(GlobalTableNames.diseases)
      .insert(value)
      .returning(diseaseColumns);
    return disease;
  }

  async findOne(condition: Partial<Disease>): Promise<Disease | undefined> {
    const [disease] = await db<Disease>(GlobalTableNames.diseases).where(condition);
    return disease;
  }

  async findOneById(id: string): Promise<Disease | undefined> {
    return this.findOne({ id });
  }

  async update(condition: Partial<Disease>, value: Partial<Disease>): Promise<number> {
    return db<Disease>(GlobalTableNames.diseases).where(condition).update(value);
  }
}

export default new DiseaseController();