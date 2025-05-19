const fs = require('fs');
const path = require('path');
const rutaUsuarios = path.join(__dirname, '../data/usuarios.json');

function leerUsuarios() {
  const data = fs.readFileSync(rutaUsuarios, 'utf-8');
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2));
}

exports.getAll = (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
};

exports.create = (req, res) => {
  const usuarios = leerUsuarios();
  const nuevo = req.body;
  nuevo.id = Date.now();
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevo);
};

exports.getById = (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.id == req.params.id);
  usuario ? res.json(usuario) : res.status(404).send('No encontrado');
};

exports.update = (req, res) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...req.body };
    guardarUsuarios(usuarios);
    res.json(usuarios[index]);
  } else {
    res.status(404).send('No encontrado');
  }
};

exports.delete = (req, res) => {
  let usuarios = leerUsuarios();
  const nuevoArray = usuarios.filter(u => u.id != req.params.id);
  if (usuarios.length === nuevoArray.length) return res.status(404).send('No encontrado');
  guardarUsuarios(nuevoArray);
  res.sendStatus(204);
};
