import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

export const bootstrap = () => {

  app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
};