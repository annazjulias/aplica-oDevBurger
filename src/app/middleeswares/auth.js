import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authToken.split(' ').at(1); // pega só o token, sem o "Bearer"

  try {
    // Verifica o token de forma síncrona
    const decoded = jwt.verify(token, authConfig.secret);

    // Seta no req os dados do usuário vindos do token
    req.userId = decoded.id;
    req.userName = decoded.name;

    return next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export default authMiddleware;
