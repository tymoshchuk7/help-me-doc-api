import { Router } from 'express';
import { authorizeUser } from '../../middlewares';
import me from './me';

export default Router()
  .get('/', authorizeUser(), me);