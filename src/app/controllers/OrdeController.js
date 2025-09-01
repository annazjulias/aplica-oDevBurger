import * as Yup from 'yup';
import Order from '../schemas/Order';
import Product from '../models/Products';
import Category from '../models/Category';

class OrderController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    try {
      schema.isValidSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }
    const { products } = req.body;
    const productsIds = products.map((product) => product.id);
    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      const productsIndex = products.findIndex(
        (item) => item.id === product.id
      );

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productsIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: formattedProducts,
      status: 'pedido realizado',
    };
    const createdOrder = await Order.create(order);
    return res.status(201).json(createdOrder);
  }
}

export default new OrderController();
