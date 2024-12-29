import { Request, Response, Router } from 'express';
import { authenticateUser, loadTenant } from '../../middlewares';

import widgets from './tableWidgetData';

export default Router()
  .get(
    '/table-widget',
    authenticateUser(),
    loadTenant([]),
    (req: Request, res: Response) => void widgets(req, res),
  );