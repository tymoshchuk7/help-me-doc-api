import { Response, Request } from 'express';
import { pick } from 'lodash';
import { asyncRoute } from '../../helpers';
import { TenantDisease } from '../../types';

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
    ...pick(data, ['name', 'description', 'treatment', 'status']),
  });

  return res.json({ disease });
});