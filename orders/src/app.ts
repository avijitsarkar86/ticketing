import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@avitickets/common';
import { listOrdersRouter } from './routes';
import { showOrdersRouter } from './routes/show';
import { newOrdersRouter } from './routes/new';
import { deleteOrdersRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // must be on HTTPS connection if not test environment
  })
);

app.use(currentUser);

app.use(listOrdersRouter);
app.use(showOrdersRouter);
app.use(newOrdersRouter);
app.use(deleteOrdersRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
