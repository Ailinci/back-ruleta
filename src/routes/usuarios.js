const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/', (req, res) => {
  const usuarios = Usuario.leerTodos();
  res.json(usuarios);
});

// Buscar por email (va antes de /:id)
router.get('/email/:email', (req, res) => {
  const usuario = Usuario.buscarPorEmail(req.params.email);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

router.get('/:id', (req, res) => {
  const usuario = Usuario.buscarPorId(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

router.post('/', (req, res) => {
  const { nombre, rol, email } = req.body;

  if (!nombre || !rol || !email) {
    return res.status(400).json({ error: 'Faltan datos: nombre, rol o email' });
  }

  // Validar email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  // ✅ Validar si el email ya existe
  if (Usuario.emailExiste(email)) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  const nuevoUsuario = new Usuario({ nombre, rol, email });
  nuevoUsuario.guardar();
  res.status(201).json(nuevoUsuario);
});


router.put('/:id', (req, res) => {
  const actualizado = Usuario.actualizarPorId(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(actualizado);
});

router.delete('/:id', (req, res) => {
  const eliminado = Usuario.eliminarPorId(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ mensaje: 'Usuario eliminado', eliminado });
});

module.exports = router;
