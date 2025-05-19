const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usuariosPath = path.join(__dirname, '..', 'usuarios.json');

const leerUsuarios = () => {
  if (!fs.existsSync(usuariosPath)) fs.writeFileSync(usuariosPath, '[]');
  const data = fs.readFileSync(usuariosPath, 'utf-8');
  return JSON.parse(data);
};

const guardarUsuarios = (usuarios) => {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
};

router.get('/', (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});

router.get('/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.id === req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

router.post('/', (req, res) => {
  const { nombre, rol } = req.body;
  if (!nombre || !rol) {
    return res.status(400).json({ error: 'Faltan datos: nombre o rol' });
  }
  const usuarios = leerUsuarios();
  const nuevoUsuario = {
    id: Date.now().toString(),
    nombre,
    rol,
  };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevoUsuario);
});

router.put('/:id', (req, res) => {
  const { nombre, rol } = req.body;
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (nombre) usuarios[index].nombre = nombre;
  if (rol) usuarios[index].rol = rol;

  guardarUsuarios(usuarios);
  res.json(usuarios[index]);
});

router.delete('/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const eliminado = usuarios.splice(index, 1)[0];
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario eliminado', eliminado });
});

module.exports = router;
