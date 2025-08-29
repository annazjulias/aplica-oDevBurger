import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductsController from './app/controllers/ProductsController';
import multer from 'multer';
import multerConfig from '../src/config/multer';
import authMiddleware from './app/middleeswares/auth.js';
import CategoryControlle from './app/controllers/CategoryControlle.js';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/products', upload.single('file'), ProductsController.store);
routes.get('/products', ProductsController.index);
routes.post('/category', upload.single('file'), CategoryControlle.store);
routes.get('/category', CategoryControlle.index);

export default routes;
