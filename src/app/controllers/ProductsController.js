import * as Yup from 'yup';
import Product from '../models/Products';
import Category from '../models/Category';

class ProductController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'É necessário enviar um arquivo.' });
      }

      const { filename: path } = req.file;
      const { name, price, category_id } = req.body;

      const product = await Product.create({
        name,
        price,
        category_id,
        path,
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
