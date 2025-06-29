const express = require('express');
const router = express.Router();
const PropiedadViewController = require('../../controllers/propiedadViewController');

// Ruta para mostrar todas las propiedades (ahora en /propiedades)
router.get('/', PropiedadViewController.renderLista);

// Ruta para mostrar el formulario de nueva propiedad
router.get('/nueva', PropiedadViewController.renderFormularioNuevo);

// Ruta para procesar el formulario de nueva propiedad
router.post('/', PropiedadViewController.crearDesdeFormulario);

// Ruta para mostrar el detalle de una propiedad
router.get('/:id', PropiedadViewController.renderDetalle);

// Ruta para mostrar el formulario de edición
router.get('/:id/editar', PropiedadViewController.renderFormularioEditar);

// Ruta para procesar el formulario de edición
router.post('/:id', PropiedadViewController.actualizarDesdeFormulario);

// Ruta para eliminar una propiedad
router.post('/:id/delete', PropiedadViewController.eliminarPropiedad);

module.exports = router;