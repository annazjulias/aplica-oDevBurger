import * as Yup from 'yup';
import Product from '../models/Products.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

class ProductController {
  /* ===============================
     CREATE
  =============================== */
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

      const user = await User.findByPk(req.userId);

      if (!user || !user.admin) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const { name, price, category_id, offer } = req.body;

      // Cloudinary
      const imageUrl = req.file.path;       // URL pública
      const publicId = req.file.filename;   // ID Cloudinary

      const product = await Product.create({
        name,
        price,
        category_id,
        offer,
        path: imageUrl,
        public_id: publicId,
      });

      return res.status(201).json(product);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return res.status(400).json({ error: err.errors });
      }

      console.error('Erro ao criar produto:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  /* ===============================
     UPDATE (imagem opcional)
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

      const user = await User.findByPk(req.userId);

      if (!user || !user.admin) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(400).json({ error: 'Produto não encontrado.' });
      }

      const updateData = {
        ...req.body,
      };

      // Atualiza imagem somente se vier nova
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

      console.error('Erro ao atualizar produto:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  /* ===============================
     INDEX
  =============================== */
  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.status(200).json(products);
    } catch (err) {
      console.error('Erro ao listar produtos:', err);
      return res.status(500).json({
        error: 'Erro ao buscar produtos.',
      });
    }
  }
}

export default new ProductController();
