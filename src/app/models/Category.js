import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING, // URL da imagem no Cloudinary
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // Retorna diretamente a URL do Cloudinary
            return this.path;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Category;