import { Router } from 'express';
import users from './users';
import tenants from './tenants';

export default Router()
  .get('/', (req, res) => res.sendStatus(200))
  .use('/users', users)
  .use('/tenants', tenants);
