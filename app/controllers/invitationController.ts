import { Model } from './AbstractModel';
import { GlobalTableNames, Invitation } from '../types';

class InvitationController extends Model<Invitation> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.invitations;
    this.columns = ['id', 'email', 'tenant', 'role'];
  }

}

export default new InvitationController();