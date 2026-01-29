import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User.js';
import Product from '../app/models/Products.js';
import Category from '../app/models/Category.js';
import configDatabese from '../config/database.js';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabese);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) =>
          model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    const mongoUrl =
      process.env.MONGODB_URL || 'mongodb://localhost:27017/devburguer';

    mongoose.connection.once('open', () => {
      console.log('MongoDB conectado com sucesso 🚀');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Erro ao conectar no MongoDB:', err);
    });

    this.mongoConnection = mongoose.connect(mongoUrl);
  }
}

export default new Database();
