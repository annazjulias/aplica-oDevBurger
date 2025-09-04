import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

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

    const { admin: isAdimin } = await User.findByPk(req.userId);

    if (!isAdimin) {
      return res.status(401).json();
    }
    const { filename: path } = req.file;
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
      path,
    });

    return res.status(201).json({ id, name });
  }

  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { admin: isAdimin } = await User.findByPk(req.userId);

    if (!isAdimin) {
      return res.status(401).json();
    }

    const { id } = req.params;

    const categoryExists = await Category.findByPk(id);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: 'o id da categoria esta correto?' });
    }

    let path;
    if (req.file) {
      path = req.file.filename;
    }
    const { name } = req.body;

    if (name) {
      const categoryExistenteName = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryExistenteName && categoryExistenteName.id === +id) {
        return res.status(400).json({ error: 'categoria ja existe' });
      }
    }
    await Category.update(
      {
        name,
        path,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json();
  }
  async index(req, res) {
    const category = await Category.findAll();

    return res.json(category);
  }
}

export default new CategoryController();
