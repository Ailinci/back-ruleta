const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuarioController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Middleware para parsear JSON
router.use(express.json());

// Proteger todas las rutas de este router con verificación de token
router.use(authMiddleware.verificarToken);

// --- Rutas Específicas ---
// Estas deben ir ANTES de las rutas dinámicas como /:id para ser alcanzadas.

// Obtener perfil del usuario autenticado (accesible para cualquier rol autenticado)
// La ruta se cambia de '/perfil/me' a '/perfil' para coincidir con el test.
router.get('/perfil', (req, res) => {
  // El middleware verificarToken ya ha puesto el usuario en req.user
  res.status(200).json({ success: true, data: req.user });
});

// Ruta de administrador (solo para admins)
router.get('/admin', authMiddleware.soloRol('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al panel de administración',
    usuario: req.user
  });
});

// --- Rutas CRUD Generales ---
// Se aplica el middleware de rol aquí en lugar de globalmente.
// 'admin' y 'secretary' pueden gestionar usuarios, como en la lógica original.
const canManageUsers = authMiddleware.soloRol('admin', 'secretary');

router.get('/', canManageUsers, UsuarioController.obtenerTodos);
router.get('/:id', canManageUsers, UsuarioController.obtenerPorId);
router.post('/', canManageUsers, UsuarioController.crearUsuario);
router.put('/:id', canManageUsers, UsuarioController.actualizarUsuario);
router.delete('/:id', canManageUsers, UsuarioController.eliminarUsuario);

// Manejo de errores de ruta
router.use(authMiddleware.manejarErroresRuta());

module.exports = router;