const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuarioController');

router.post('/', UsuarioController.crearUsuario);
router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;
