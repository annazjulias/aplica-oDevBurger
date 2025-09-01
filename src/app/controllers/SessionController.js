import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

class SessionControler {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(req.body);
    const emailPassword = () =>
      res.status(401).json({ error: 'email ou senha incorreto' });

    if (!isValid) {
      return emailPassword();
    }
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return emailPassword();
    }

    const isSamePasswoed = await user.comparePassword(password);
    if (!isSamePasswoed) {
      return emailPassword();
    }
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionControler();
