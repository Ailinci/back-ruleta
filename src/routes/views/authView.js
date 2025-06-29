const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// Muestra el formulario de registro
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Registro' });
});

// Muestra el formulario de login
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Iniciar Sesión' });
});

// Procesa el formulario de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authController.loginUser(email, password);

    // Guardar token en una cookie segura
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo https en producción
      maxAge: 3600000 // 1 hora
    });

    res.redirect('/');
  } catch (error) {
    res.render('auth/login', {
      title: 'Iniciar Sesión',
      error: error.message
    });
  }
});

// Procesa el formulario de registro
router.post('/register', async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;
      await authController.registerUser({ nombre, email, password, rol });
      res.redirect('/auth/login');
    } catch (error) {
      res.render('auth/register', {
        title: 'Registro',
        error: error.message,
        nombre: req.body.nombre,
        email: req.body.email
      });
    }
  });

// Ruta de logout
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // Expira la cookie inmediatamente
  res.redirect('/auth/login');
});

module.exports = router; 