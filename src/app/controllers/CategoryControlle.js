import * as Yup from 'yup';
import Category from '../models/Category';

class CategoryController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }
    const { name } = req.body;

    const categoryExistente = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExistente) {
      return res.status(400).json({ error: 'categoria ja existe' });
    }

    const { id } = await Category.create({
      name,
    });

    return res.status(201).json({ id, name });
  }

  async index(req, res) {
    const category = await Category.findAll();

    return res.json(category);
  }
}

export default new CategoryController();
