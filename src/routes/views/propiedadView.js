const express = require('express');
const router = express.Router();
const PropiedadViewController = require('../../controllers/propiedadViewController');

// Rutas para las vistas de propiedades
router.get('/', PropiedadViewController.renderLista);
router.get('/nueva', PropiedadViewController.renderFormularioNuevo);
router.get('/:id', PropiedadViewController.renderDetalle);
router.get('/:id/editar', PropiedadViewController.renderFormularioEditar);
router.post('/', PropiedadViewController.crearDesdeFormulario);
router.post('/:id', PropiedadViewController.actualizarDesdeFormulario);

module.exports = router;