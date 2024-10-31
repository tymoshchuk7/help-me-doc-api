import { Router } from 'express';
import users from './users';
import tenants from './tenants';
import invitations from './invitations';

export default Router()
  .get('/', (req, res) => res.sendStatus(200))
  .use('/users', users)
  .use('/tenants', tenants)
  .use('/invitations', invitations);
