import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductsController';
import multer from 'multer';
import multerConfig from '../src/config/multer';
import authMiddleware from './app/middleeswares/auth.js';
import CategoryControlle from './app/controllers/CategoryControlle.js';
import OrdeController from './app/controllers/OrdeController.js';
import CreatePaymentController from './app/controllers/stripe/CreatePaymentController.js';


const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);



routes.use(authMiddleware);

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put(
  '/products/:id',
  authMiddleware,
  upload.single('file'),
  ProductController.update // ✅ função válida
);

routes.post('/categories', upload.single('file'), CategoryControlle.store);
routes.get('/categories', CategoryControlle.index);
routes.put('/categories/:id', upload.single('file'), CategoryControlle.update);

routes.post('/orders', OrdeController.store);
routes.get('/orders', OrdeController.index);
routes.put('/orders/:id', OrdeController.update);

routes.post('/create-payment-intent', CreatePaymentController.store);
export default routes;
