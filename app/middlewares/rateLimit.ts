import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import commonErrorCatchMiddleware from './commonErrorCatchMiddleware';
import { config } from '../config';
import { AccessError } from '../types';

const redis = new Redis(config.redisUrl);

interface Params {
  rate: string,
}

const getRequestKey = (req: Request) => `${req.headers['x-forwarded-for'] || req.connection.remoteAddress}${req.originalUrl}`;

const millisecondsInSecond = 1000;
const millisecondsInMinute = millisecondsInSecond * 60;
const millisecondsInHour = millisecondsInMinute * 60;
const millisecondsInHalfOfHour = millisecondsInMinute * 30;

const periodsMap: Record<string, number> = {
  'minute': millisecondsInMinute,
  'hour': millisecondsInHour,
  'half-hour': millisecondsInHalfOfHour,
};

const getRequestRate = (rate: string) => {
  const [number, period] = rate.split('/').map((i) => i.trim());
  return { number: Number(number), period: periodsMap[period] };
};

export default ({ rate }: Params): [
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void | Response>,
  (
  err: AccessError,
  req: Request,
  res: Response,
  next: NextFunction) => void,
] => [
  async (req: Request, response: Response, next: NextFunction) => {
    if (!redis) {
      return next();
    }

    const key = getRequestKey(req);
    const { period, number } = getRequestRate(rate);

    if (!key) {
      return next(new Error('Request id is missing'));
    }

    const replies = await redis.multi()
      .incr(key)
      .pttl(key)
      .exec();

    if (replies) {
      const hits = replies[0][1];
      const ttl = replies[1][1];

      if (hits === 1 || ttl === -1) {
        await redis.pexpire(key, period);
      }

      if (hits as number > number) {
        const error = new Error(
          'Too many requests',
        ) as AccessError;
        error.statusCode = 429;
        return next(error);

      }
    }

    next();
  },
  commonErrorCatchMiddleware,
];

