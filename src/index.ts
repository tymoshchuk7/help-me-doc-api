import express from 'express';
import { initGlobalTables } from './database';

const app = express();
const PORT = process.env.PORT || 8000;

export const bootstrap = async () => {
  await initGlobalTables();
  app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
};