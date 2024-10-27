import { Model } from './AbstractModel';
import TenantController from './tenantController';
import { GlobalTableNames, User } from '../types';

class UserController extends Model<User> {

  tableName: GlobalTableNames;

  columns: string[];

  constructor() {
    super();
    this.tableName = GlobalTableNames.users;
    this.columns = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'default_tenant', 'avatar'];
  }

  async findUserJoiningParticipant(userId: string) {
    const user = await super.findOneById(userId);
    if (!user) {
      throw new Error('User is missing');
    }

    const tenant = await TenantController.findOneById(user.default_tenant);
    if (!tenant) {
      throw new Error('Tenant is missing');
    }

    const result: User & {
      participant_id: string,
      participant_status: string,
      participant_role: string,
    } = await super.query()
      .leftJoin(tenant.tenant_participants_table, 'users.id', `${tenant.tenant_participants_table}.user_id`)
      .where({ 'users.id': user.id })
      .select(
        'users.id',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.phone_number',
        'users.avatar',
        'users.default_tenant',
        `${tenant.tenant_participants_table}.id as participant_id`,
        `${tenant.tenant_participants_table}.status as participant_status`,
        `${tenant.tenant_participants_table}.role as participant_role`,
      )
      .first();

    if (!result) {
      throw new Error('Could not to find related participant');
    }

    const adjustedResult = {
      id: result.id,
      email: result.email,
      first_name: result.first_name,
      last_name: result.last_name,
      phone_number: result.phone_number,
      avatar: result.avatar,
      default_tenant: result.default_tenant,
      participant: {
        participant_id: result.participant_id,
        participant_status: result.participant_status,
        participant_role: result.participant_role,
      },
    };

    return adjustedResult;
  }
}

export default new UserController();