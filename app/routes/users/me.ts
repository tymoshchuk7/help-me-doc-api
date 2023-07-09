import { Response, Request } from 'express';

export default function (req: Request, res: Response) {
  return res.json({ user: req.user });
}