import Sequelize from 'sequelize';
import User from '../app/models/User';
import configDatabese from '../config/database';
import Product from '../app/models/Products';
import Category from '../app/models/Category';
import mongoose from 'mongoose';

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
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
  mongo() {
    this.connection = mongoose.connect('mongodb://localhost:27017/devburguer');
  }
  
}

export default new Database();
