import { ModelMeta } from '../types';

export default function prepareAPIResponse(data: ModelMeta | Array<ModelMeta>) {
  const response: Record<string, any> = {};
  const adjustedData = Array.isArray(data) ? data : [data];

  adjustedData.forEach((entity) => {
    response[entity.id] = entity;
  });

  return response;
}