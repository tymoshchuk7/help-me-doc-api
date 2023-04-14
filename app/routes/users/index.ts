import { Router } from 'express';
import { authorizeUser } from '../../middlewares';
import get from './get';

export default Router()
  .get('/', authorizeUser(), get);