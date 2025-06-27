const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

// Rutas de vistas
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// Rutas de API
router.post('/api/login', authController.apiLogin);
router.post('/api/register', authController.apiRegister);
router.post('/api/logout', authController.apiLogout);
router.get('/api/me', verificarToken, authController.me);

module.exports = router;