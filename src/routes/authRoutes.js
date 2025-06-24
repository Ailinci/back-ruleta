const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;

const authController = require('../../controllers/authController');
const { verificarToken, soloRol } = require('../../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida de ejemplo
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ message: `Hola ${req.user.id}, estás autenticado.` });
});

router.get('/solo-admin', verificarToken, soloRol('admin'), (req, res) => {
  res.json({ message: 'Bienvenido admin.' });
});

module.exports = router;
