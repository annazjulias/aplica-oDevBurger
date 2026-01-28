import * as Yup from 'yup';
import Product from '../models/Products.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

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

      const { admin: isAdmin } = await User.findByPk(req.userId);

      if (!isAdmin) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const { name, price, category_id, offer } = req.body;

      // 👉 Cloudinary
      const imageUrl = req.file.path;       // URL pública
      const publicId = req.file.filename;   // id do Cloudinary

      const product = await Product.create({
        name,
        price,
        category_id,
        path: imageUrl,
        public_id: publicId,
        offer,
      });

      return res.status(201).json(product);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return res.status(400).json({ error: err.errors });
      }

      console.error(err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  /* ===============================
     UPDATE — imagem OPCIONAL
  =============================== */
  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { admin } = await User.findByPk(req.userId);

      if (!admin) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(400).json({ error: 'Produto não encontrado.' });
      }

      const { name, price, category_id, offer } = req.body;

      const updateData = {
        name,
        price,
        category_id,
        offer,
      };

      // 👉 Atualiza imagem SOMENTE se vier nova
      if (req.file) {
        updateData.path = req.file.path;
        updateData.public_id = req.file.filename;
      }

      await product.update(updateData);

      return res.status(200).json(product);
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
