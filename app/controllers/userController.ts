import { db } from '../database';
import { User, GlobalTableNames } from '../types';

const userColumns = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'defaultTenant', 'avatar'];

class UserController {
  async create(value: Partial<User>): Promise<User> {
    const [user]: User[] = await db<User>(GlobalTableNames.users)
      .insert(value)
      .returning(userColumns);
    return user;
  }

  async findOne(condition: Partial<User>): Promise<User | undefined> {
    const [user] = await db<User>(GlobalTableNames.users).where(condition);
    return user;
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.findOne({ id });
  }

  async update(condition: Partial<User>, value: Partial<User>): Promise<User | undefined> {
    const [user]: User[] = await db<User>(GlobalTableNames.users)
      .update(value)
      .where(condition)
      .returning(userColumns);
    return user;
  }
}

export default new UserController();