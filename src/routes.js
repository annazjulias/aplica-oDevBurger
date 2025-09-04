import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductsController from './app/controllers/ProductsController';
import multer from 'multer';
import multerConfig from '../src/config/multer';
import authMiddleware from './app/middleeswares/auth.js';
import CategoryControlle from './app/controllers/CategoryControlle.js';
import OrdeController from './app/controllers/OrdeController.js';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/products', upload.single('file'), ProductsController.store);
routes.get('/products', ProductsController.index);
routes.put('/products/:id', upload.single('file'), ProductsController.updade);

routes.post('/category', upload.single('file'), CategoryControlle.store);
routes.get('/category', CategoryControlle.index);
routes.put('/category/:id', upload.single('file'), CategoryControlle.update);

routes.post('/orders', OrdeController.store);
routes.get('/orders', OrdeController.index);
routes.put('/orders/:id', OrdeController.update);

export default routes;
