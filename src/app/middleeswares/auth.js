import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'token nao valido' });
  }

  const token = authToken.split(' ').at(1);

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }

      req.userId = decoded.id;
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ error: 'token invalido' });
  }
  return next();
}
export default authMiddleware;
