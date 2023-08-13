import { Model } from './AbstractModel';
import { Disease, GlobalTableNames } from '../types';

class DiseaseController extends Model<Disease> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.diseases;
    this.columns = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'defaultTenant', 'avatar'];
  }

}

export default new DiseaseController();