import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: process.env.APP_URL }));
app.use(json());
app.use(morgan('tiny'));
app.use('/v1', routes);

const PORT = process.env.PORT || 8000;

export const bootstrap = () => {
  app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
};