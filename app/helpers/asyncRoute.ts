import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';

type ReturnType = Promise<void | Response> | void | Response;

export default function asyncRoute(
  fn: (
    req: AuthRequest, res: Response, next?: NextFunction
  ) => ReturnType,
) {
  return (req: AuthRequest, res: Response): ReturnType => Promise.resolve(
    fn(req, res),
  ).catch((err: { errors?: [] }) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(400).json({
      error: String(err),
    });
  });
}
