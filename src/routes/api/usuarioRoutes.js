const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuarioController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Middleware para parsear JSON
router.use(express.json());

// Proteger todas las rutas
router.use(authMiddleware.verificarToken);
router.use(authMiddleware.soloRol('admin', 'secretary'));

// Rutas de API para usuarios
router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.post('/', UsuarioController.crearUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);

// Obtener perfil del usuario autenticado (ruta especial)
router.get('/perfil/me', (req, res) => {
  // El middleware verificarToken ya ha puesto el usuario en req.user
  res.json(req.user);
});

// Rutas de administrador
router.get('/admin', authMiddleware.soloRol('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al panel de administración',
    usuario: req.user
  });
});

// Manejo de errores de ruta
router.use(authMiddleware.manejarErroresRuta());

module.exports = router;