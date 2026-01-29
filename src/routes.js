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

// Rotas públicas (sem autenticação)
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryControlle.index);

// A partir daqui, todas precisam de autenticação
routes.use(authMiddleware);

// Produtos (admin apenas)
routes.post('/products', upload.single('file'), ProductController.store);
routes.put('/products/:id', upload.single('file'), ProductController.update);

// Categorias (admin apenas)
routes.post('/categories', upload.single('file'), CategoryControlle.store);
routes.put('/categories/:id', upload.single('file'), CategoryControlle.update);

// Pedidos
routes.post('/orders', OrdeController.store);
routes.get('/orders', OrdeController.index);
routes.put('/orders/:id', OrdeController.update);

// Pagamento
routes.post('/create-payment-intent', CreatePaymentController.store);

export default routes;