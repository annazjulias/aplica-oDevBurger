import routes from './routes';
import express from 'express';
import './database';
import { resolve } from 'node:path';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      '/products-file',
      express.static(resolve(__dirname, '..', 'uploades'))
    );
  }
  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
