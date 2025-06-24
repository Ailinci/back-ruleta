const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { verificarToken, soloRol } = require('../middlewares/authMiddleware');

//  Proteger todas las rutas
router.use(verificarToken);

//  Proteger solo para rol 'Admin'
router.post('/', soloRol('Admin'), UsuarioController.crearUsuario);
router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', soloRol('Admin'), UsuarioController.eliminar);

module.exports = router;
