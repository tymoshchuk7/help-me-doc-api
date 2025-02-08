import { NextFunction, Response, Request } from 'express';
import { ApiException } from '../exceptions';

type ReturnType = Promise<void | Response> | void | Response;

export default function asyncRoute(
  fn: (
    req: Request, res: Response, next?: NextFunction
  ) => ReturnType,
) {
  return (req: Request, res: Response): ReturnType => Promise.resolve(
    fn(req, res),
  ).catch((err: ApiException) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.statusCode || 400).json({
      error: String(err),
    });
  });
}
