const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = {
  verificarToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Acceso denegado. Token no proporcionado'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id).select('-password');

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Usuario no encontrado'
        });
      }

      req.user = usuario;
      next();
    } catch (error) {
      console.error('Error en verificación de token:', error);
      
      let message = 'Token inválido';
      if (error.name === 'TokenExpiredError') {
        message = 'Token expirado. Por favor inicie sesión nuevamente';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Token malformado';
      }

      return res.status(401).json({
        success: false,
        message
      });
    }
  },

  soloRol: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: 'Acceso prohibido. No tiene los permisos necesarios'
        });
      }
      next();
    };
  },

  // Middleware para manejar errores estándar
  manejarErrores: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  },

  // Middleware para manejar errores de rutas
  manejarErroresRuta: () => {
    return (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    };
  }
};