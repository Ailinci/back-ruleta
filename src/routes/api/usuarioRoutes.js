const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuarioController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Middleware para parsear JSON
router.use(express.json());

// Proteger todas las rutas
router.use(authMiddleware.verificarToken);

// Obtener perfil del usuario autenticado
router.get('/perfil', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        usuario: req.user
      }
    });
  } catch (error) {
    next(error);
  }
});

// Rutas de administrador
router.get('/admin', authMiddleware.soloRol('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al panel de administración',
    usuario: req.user
  });
});

// Actualizar usuario
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.user._id.toString() !== id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este usuario'
      });
    }

    const usuarioActualizado = await UsuarioController.actualizarUsuario(id, updates);
    res.status(200).json({
      success: true,
      data: usuarioActualizado
    });
  } catch (error) {
    next(error);
  }
});

// Manejo de errores de ruta
router.use(authMiddleware.manejarErroresRuta());

module.exports = router;