const jwt = require('jsonwebtoken');
const UsuarioService = require('../services/usuarioService');

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await UsuarioService.obtenerPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const verificarAutenticacion = async (req, res, next) => {
  try {
    const token = req.session?.token || req.cookies?.token;
    
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await UsuarioService.obtenerPorId(decoded.id);
    
    if (!usuario) {
      req.session.token = null;
      return res.redirect('/auth/login');
    }

    req.usuario = usuario;
    res.locals.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en verificarAutenticacion:', error);
    req.session.token = null;
    return res.redirect('/auth/login');
  }
};

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  verificarAutenticacion,
  verificarRol
};