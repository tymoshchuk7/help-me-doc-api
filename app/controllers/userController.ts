import { Model } from './AbstractModel';
import { GlobalTableNames, User } from '../types';

class UserController extends Model<User> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.users;
    this.columns = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'default_tenant', 'avatar'];
  }

}

export default new UserController();