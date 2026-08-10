import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { preUploadFile } from '../../s3_client';

interface Body {
  data: {
    originalName: string
  };
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { data: { originalName } } = req.body;
  const { tenantParticipant } = req;
  const [imageName, imageExt] = originalName.split('.');
  const fileKey = `chat-images/${tenantParticipant.id}/${imageName}-${Date.now()}.${imageExt}`;

  const uploadUrl = await preUploadFile(fileKey);

  return res.json({ uploadUrl, originalName, fileKey });
});