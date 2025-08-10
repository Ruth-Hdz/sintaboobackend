import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET_USER;

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.rol !== 'usuario') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
