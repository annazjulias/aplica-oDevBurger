import Stripe from "stripe";
import * as yup from "yup";
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      quantity: yup.number().required(),
      price: yup.number().required(),
    })
  ).required(),
});

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return acc + (current.price * current.quantity);
  }, 0);
  return Math.round(total);
};

class CreatePaymentController {
  async store(req, res) {
    try {
      await paymentSchema.validate(req.body, { abortEarly: false });
      
      const { items } = req.body;
      const amount = calculateOrderAmount(items);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "brl",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // ✅ Usando 'res' em vez de 'response'
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });

    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: err.errors 
        });
      }

      if (err.type === 'StripeError') {
        return res.status(500).json({ 
          error: 'Erro ao processar pagamento',
          message: err.message 
        });
      }

      console.error('Erro no processamento:', err);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
}

export default new CreatePaymentController();