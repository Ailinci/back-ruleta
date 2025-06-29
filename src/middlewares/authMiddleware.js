const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = {
  verificarToken: async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    // 1. Intentar obtener el token del header 'Authorization'
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // 2. Si no está en el header, intentar obtenerlo de la cookie
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

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

  // Middleware para cargar el usuario desde el token en la cookie
  cargarUsuario: async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id).select('-password');
        if (usuario) {
          // Poner el usuario en res.locals para que esté disponible en todas las vistas
          // y en req.user para consistencia con el middleware de API.
          res.locals.user = usuario;
          req.user = usuario;
        }
      } catch (error) {
        // Si el token es inválido (expirado, etc.), no hacemos nada, el usuario no se cargará
        console.error('Error al verificar token de cookie:', error.message);
      }
    }
    next();
  },
  
  // Middleware para requerir un rol específico en vistas
  requireRole: (...roles) => {
    return (req, res, next) => {
      // requireAuth debería haberse ejecutado antes
      if (res.locals.user && roles.includes(res.locals.user.rol)) {
        return next();
      }
      const err = new Error('Acceso prohibido: No tiene los permisos necesarios.');
      err.status = 403;
      next(err);
    };
  },

  // Middleware mejorado para verificar permisos sobre otro usuario
  checkUserPermission: async (req, res, next) => {
    try {
      const targetUserId = req.params.id;
      const currentUser = req.user;

      // Un usuario no puede modificarse a sí mismo en estas rutas
      if (currentUser.id === targetUserId) {
        const err = new Error('Operación no permitida sobre uno mismo.');
        err.status = 403;
        return next(err);
      }

      // Un secretario no puede modificar a un admin
      if (currentUser.rol === 'secretary') {
        const targetUser = await require('../repositories/usuarioRepositoryMONGO').getById(targetUserId);
        if (targetUser && targetUser.rol === 'admin') {
          const err = new Error('Acceso prohibido: Un secretario no puede modificar a un administrador.');
          err.status = 403;
          return next(err);
        }
      }
      
      next();
    } catch (err) {
      next(err);
    }
  },

  // Middleware para requerir autenticación en vistas
  requireAuth: (req, res, next) => {
    if (res.locals.user) {
      next();
    } else {
      res.redirect('/auth/login');
    }
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