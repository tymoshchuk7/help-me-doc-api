import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { config } from '../config';
import { ApiError } from '../utils';
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

export default ({ rate }: Params): (req: Request, res: Response, next: NextFunction) => Promise<void | Response> =>
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      if (!redis) {
        return next();
      }

      const key = getRequestKey(req);
      const { period, number } = getRequestRate(rate);

      if (!key) {
        return next(new ApiError({ message: 'Request id is missing.' }));
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
          return next(new ApiError({ message: 'Too many requests. Please, try again later', statusCode: 429 }));
        }
      }

      next();
    } catch (e) {
      const error = e as AccessError;
      error.statusCode = 500;
      next(error);
    }
  };

