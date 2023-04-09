import { Response } from 'express';
import { AuthRequest } from '../../types';

export default function (req: AuthRequest, res: Response) {
  return res.json({ user: req.user });
}