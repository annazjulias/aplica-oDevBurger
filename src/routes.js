import { Router } from 'express';

import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductsController.js';
import CategoryControlle from './app/controllers/CategoryControlle.js';
import OrdeController from './app/controllers/OrdeController.js';
import CreatePaymentController from './app/controllers/stripe/CreatePaymentController.js';

import upload from './config/multer.js';
import authMiddleware from './app/middleeswares/auth.js';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put(
  '/products/:id',
  upload.single('file'),
  ProductController.update
);

routes.post('/categories', upload.single('file'), CategoryControlle.store);
routes.get('/categories', CategoryControlle.index);
routes.put(
  '/categories/:id',
  upload.single('file'),
  CategoryControlle.update
);

routes.post('/orders', OrdeController.store);
routes.get('/orders', OrdeController.index);
routes.put('/orders/:id', OrdeController.update);

routes.post(
  '/create-payment-intent',
  CreatePaymentController.store
);

export default routes;
