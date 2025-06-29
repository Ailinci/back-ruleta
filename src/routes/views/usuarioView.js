const express = require('express');
const router = express.Router();
const UsuarioViewController = require('../../controllers/usuarioViewController');
const { checkUserPermission } = require('../../middlewares/authMiddleware');

// Ruta para mostrar todos los usuarios
router.get('/', UsuarioViewController.renderLista);

// Ruta para mostrar el formulario de nuevo usuario
router.get('/nuevo', UsuarioViewController.renderFormularioNuevo);

// Ruta para procesar el formulario de nuevo usuario
router.post('/', UsuarioViewController.crearDesdeFormulario);

// Ruta para mostrar el detalle de un usuario
router.get('/:id', UsuarioViewController.renderDetalle);

// Rutas con chequeo de permisos sobre otro usuario
router.get('/:id/editar', checkUserPermission, UsuarioViewController.renderFormularioEditar);
router.post('/:id', checkUserPermission, UsuarioViewController.actualizarDesdeFormulario);
router.post('/:id/delete', checkUserPermission, UsuarioViewController.eliminarUsuario);

module.exports = router;
