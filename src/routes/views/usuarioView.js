const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuarioViewController');

router.get('/', UsuarioController.renderLista);
router.get('/nuevo', UsuarioController.renderFormularioNuevo);
router.get('/:id', UsuarioController.renderDetalle);
router.get('/:id/editar', UsuarioController.renderFormularioEditar);
router.post('/', UsuarioController.crearDesdeFormulario); // Crear usuario desde formulario

module.exports = router;
