import * as Yup from 'yup';
import Product from '../models/Products';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'É necessário enviar um arquivo.' });
      }

      const { admin: isAdimin } = await User.findByPk(req.userId);

      if (!isAdimin) {
        return res.status(401).json();
      }

      const { filename: path } = req.file;
      const { name, price, category_id, offer } = req.body;

      const product = await Product.create({
        name,
        price,
        category_id,
        path,
        offer,
      });

      return res.status(201).json({ product });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return res.status(400).json({ error: err.errors });
      }

      console.error(err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async updade(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'É necessário enviar um arquivo.' });
      }

      const { admin: isAdimin } = await User.findByPk(req.userId);

      if (!isAdimin) {
        return res.status(401).json();
      }

      const { id } = req.params;
      const findProducts = await Product.findByPk(id);

      if (!findProducts) {
        return res.status(400).json({ error: 'id do produto nao existe' });
      }

      let path;
      if (req.file) {
        path = req.file.filename;
      }

      const { name, price, category_id, offer } = req.body;

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(201).json();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return res.status(400).json({ error: err.errors });
      }

      console.error(err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async index(req, res) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(products);
  }
}

export default new ProductController();
