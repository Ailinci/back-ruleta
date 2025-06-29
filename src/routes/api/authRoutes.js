const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UsuarioRepo = require('../../repositories/usuarioRepositoryMONGO');
const authController = require('../../controllers/authController');
const JWT_SECRET = process.env.JWT_SECRET;

// Ruta de registro
router.post('/register', async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const nuevoUsuario = await authController.registerUser({ nombre, email, password });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuarioId: nuevoUsuario._id
    });
  } catch (error) {
    // Si el email ya existe, el controlador lanzará un error.
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
});

// ⚠️ Versión simple SIN hash de contraseña
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña obligatorios' });

    const token = await authController.loginUser(email, password);
    res.json({ token });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
