import { Model } from './AbstractModel';
import { Disease, GlobalTableNames } from '../types';

class DiseaseController extends Model<Disease> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.diseases;
    this.columns = ['id', 'user_id', 'name', 'status', 'description', 'treatment'];
  }

}

export default new DiseaseController();