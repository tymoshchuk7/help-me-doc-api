import express, { json } from 'express';
import cors from 'cors';
import { initGlobalTables } from './database';
import routes from './routes';

const app = express();

app.disable('x-powered-by');
app.use(json());
app.use(cors({ origin: process.env.APP_URL }));
app.use('/v1', routes);

const PORT = process.env.PORT || 8000;

export const bootstrap = async () => {
  await initGlobalTables();
  app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
};