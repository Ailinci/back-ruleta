const express = require('express');
const router = express.Router();
const PropiedadController = require('../../controllers/propiedadController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Proteger todas las rutas de API de propiedades
router.use(authMiddleware.verificarToken);
router.use(authMiddleware.soloRol('admin', 'agent'));

// Rutas CRUD para propiedades
router.post('/', PropiedadController.crearPropiedad);
router.get('/', PropiedadController.obtenerTodas);
router.get('/:id', PropiedadController.obtenerPorId);
router.put('/:id', PropiedadController.actualizar);
router.patch('/:id/estado', PropiedadController.cambiarEstado);
router.delete('/:id', PropiedadController.eliminar);

module.exports = router;