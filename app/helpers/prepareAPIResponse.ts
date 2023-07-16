
interface Entity {
  id: string,
  [key: string]: any,
}

export default function prepareAPIResponse(data: Entity | Array<Entity>) {
  const response: Record<string, any> = {};
  const adjustedData = Array.isArray(data) ? data : [data];

  adjustedData.forEach((entity) => {
    response[entity.id] = entity;
  });

  return response;
}