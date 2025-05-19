const fs = require('fs');
const path = require('path');
const usuariosPath = path.join(__dirname, '..', 'database', 'usuarios.json');

const leerUsuarios = () => {
  if (!fs.existsSync(usuariosPath)) fs.writeFileSync(usuariosPath, '[]');
  return JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
};

const guardarUsuarios = (usuarios) => {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
};

const UsuarioRepositoryJSON = {
  getAll() {
    return leerUsuarios();
  },

  getById(id) {
    return leerUsuarios().find(u => u.id === id);
  },

  getByEmail(email) {
    return leerUsuarios().find(u => u.email === email);
  },

  existsByEmail(email) {
    return leerUsuarios().some(u => u.email === email);
  },

  save(usuario) {
    const usuarios = leerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    return usuario;
  },

  update(id, datos) {
    const usuarios = leerUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    usuarios[index] = { ...usuarios[index], ...datos };
    guardarUsuarios(usuarios);
    return usuarios[index];
  },

  delete(id) {
    const usuarios = leerUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    const eliminado = usuarios.splice(index, 1)[0];
    guardarUsuarios(usuarios);
    return eliminado;
  },
};

module.exports = UsuarioRepositoryJSON;
