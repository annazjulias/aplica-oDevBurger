import express from 'express';
import cors from 'cors';
import { resolve } from 'node:path';

import routes from './routes.js';
import './database';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://devburguerinterface.onrender.com',
    ];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.app.use(express.json());

    // arquivos estáticos
    this.app.use(
      '/products-file',
      express.static(resolve(process.cwd(), 'uploades'))
    );

    this.app.use(
      '/category-file',
      express.static(resolve(process.cwd(), 'uploades'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
