import { Request, Response, Router } from 'express';
import { authenticateUser, loadTenant } from '../../middlewares';

import tableWidget from './tableWidgetData';
import calendarWidget from './calendarWidget';

export default Router()
  .get(
    '/table-widget',
    authenticateUser(),
    loadTenant([]),
    (req: Request, res: Response) => void tableWidget(req, res),
  )
  .get(
    '/calendar-widget',
    authenticateUser(),
    loadTenant([]),
    (req: Request, res: Response) => void calendarWidget(req, res),
  );