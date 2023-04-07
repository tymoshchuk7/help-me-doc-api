import express, { json } from 'express';
import cors from 'cors';
import { initGlobalTables } from './database';

const app = express();

app.disable('x-powered-by');
app.use(json());
app.use(cors({ origin: 'http://localhost:3000' }));

const PORT = process.env.PORT || 8000;

export const bootstrap = async () => {
  await initGlobalTables();
  app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
};