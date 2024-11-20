import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit, errorHandler } from './middlewares';
import { config } from './config';
import routes from './routes';
import { initializeSocketIO } from './socketIOServer';

const app = express();
const server = initializeSocketIO(app);

app.disable('x-powered-by');
app.use(cors({ origin: config.appUrl }));
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(rateLimit({ rate: config.apiThrottleRate }));
app.use(json());
app.use(morgan('tiny'));
app.use('/v1', routes);
app.use(errorHandler);

export const bootstrap = () => {
  server.listen(config.appPort, () => console.log(`Server has been started on ${config.appPort}`));
};