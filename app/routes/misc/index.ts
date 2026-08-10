import { Request, Response, Router } from 'express';
import { authenticateUser, loadTenant, validate } from '../../middlewares';
import { miscValidation } from '../../validation';

import tableWidget from './tableWidgetData';
import calendarWidget from './calendarWidget';
import getSignedUrl from './getSignedS3Url';

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
  )
  .post(
    '/signed-url',
    authenticateUser(),
    ...validate(miscValidation.signedUrlSchema),
    (req: Request, res: Response) => void getSignedUrl(req, res),
  );