const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token faltante.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

exports.soloRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== rolPermitido) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
};
