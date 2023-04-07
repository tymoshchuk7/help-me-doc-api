import { Router } from 'express';
import users from './users';

export default Router()
  .get('/', (req, res) => res.sendStatus(200))
  .use('/users', users);
