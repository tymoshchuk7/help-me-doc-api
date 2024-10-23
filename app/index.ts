import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from './middlewares';
import { config } from './config';
import routes from './routes';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: config.appUrl }));
app.use(rateLimit({ rate: config.apiThrottleRate }));
app.use(json());
app.use(morgan('tiny'));
app.use('/v1', routes);

export const bootstrap = () => {
  app.listen(config.appPort, () => console.log(`Server has been started on ${config.appPort}`));
};