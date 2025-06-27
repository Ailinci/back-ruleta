const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UsuarioRepo = require('../../repositories/usuarioRepositoryMONGO');
const JWT_SECRET = process.env.JWT_SECRET;

// ⚠️ Versión simple SIN hash de contraseña
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña obligatorios' });

  const usuario = await UsuarioRepo.getByEmail(email);
  if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' });

  // Comparación sin hash (provisorio)
  if (usuario.password !== password) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
