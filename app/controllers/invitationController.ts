import { db } from '../database';
import { Invitation, GlobalTableNames } from '../types';

const invitationColumns = ['id', 'email', 'tenant', 'role'];

class InvitationController {
  async create(value: Partial<Invitation>): Promise<Invitation> {
    const [invitation]: Invitation[] = await db<Invitation>(GlobalTableNames.invitations)
      .insert(value)
      .returning(invitationColumns);
    return invitation;
  }

  async findOne(condition: Partial<Invitation>): Promise<Invitation | undefined> {
    const [invitation] = await db<Invitation>(GlobalTableNames.invitations).where(condition);
    return invitation;
  }

  async findOneById(id: string): Promise<Invitation | undefined> {
    return this.findOne({ id });
  }

  async update(condition: Partial<Invitation>, value: Partial<Invitation>): Promise<Invitation | undefined> {
    return db<Invitation>(GlobalTableNames.invitations)
      .where(condition)
      .update(value);
  }
}

export default new InvitationController();