import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

class UserController {
  async store(request, response) {
    // Definindo o schema de validação
    const schema = Yup.object({
      name: Yup.string().required('O nome é obrigatório'),
      email: Yup.string().email('Email inválido').required('O email é obrigatório'),
      password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
      admin: Yup.boolean(),
    });

    try {
      // Validação dos dados enviados
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ errors: err.errors });
    }

    const { name, email, password, admin } = request.body;

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return response.status(400).json({ error: 'Email já está cadastrado' });
    }

    // Cria o usuário no banco de dados
    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password,
      admin,
    });

    // Retorna os dados do usuário criado (sem senha)
    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  }
}

export default new UserController();
