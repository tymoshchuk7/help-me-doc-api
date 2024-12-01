import { Response, Request } from 'express';
import { asyncRoute } from '../../helpers';
import { TenantDisease } from '../../types';
import { pickFromObject } from '../../utils';

interface Body {
  data: Pick<TenantDisease, 'name' | 'description' | 'treatment' | 'status'>,
}

interface Params {
  [key: string]: string,
}

export default asyncRoute(async (req: Request<Params, object, Body>, res: Response) => {
  const { tenant, params: { id }, body: { data } } = req;

  const { DiseaseController } = tenant;

  const disease = await DiseaseController.update({ id }, {
    ...pickFromObject<TenantDisease>(data, ['name', 'description', 'treatment', 'status']),
  });

  return res.json({ disease });
});