import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { getSignedUrl } from '../../s3_client';

interface Body {
  data: {
    path: string
  };
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const url = await getSignedUrl(req.body.data.path);

  return res.json({ url });
});