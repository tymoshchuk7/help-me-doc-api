import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: config.appUrl }));
app.use(json());
app.use(morgan('tiny'));

export const bootstrap = () => {
  app.listen(config.appPort, () => console.log(`Server has been started on ${config.appPort}`));
};