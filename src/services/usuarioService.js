const { v4: uuidv4 } = require('uuid');
const UsuarioRepo = require('../repositories/usuarioRepositoryJSON');

class UsuarioService {
  static crearUsuario({ nombre, rol, email }) {
    if (!nombre || !rol || !email) throw new Error('Faltan datos');
    if (UsuarioRepo.existsByEmail(email)) throw new Error('Email ya registrado');

    const nuevoUsuario = { id: uuidv4(), nombre, rol, email };
    return UsuarioRepo.save(nuevoUsuario);
  }

  static listarUsuarios() {
    return UsuarioRepo.getAll();
  }

  static obtenerPorId(id) {
    return UsuarioRepo.getById(id);
  }

  static obtenerPorEmail(email) {
    return UsuarioRepo.getByEmail(email);
  }

  static actualizarUsuario(id, datos) {
    if (datos.email) {
      const existente = UsuarioRepo.getByEmail(datos.email);
      if (existente && existente.id !== id) throw new Error('Email en uso');
    }
    return UsuarioRepo.update(id, datos);
  }

  static eliminarUsuario(id) {
    const usuario = UsuarioRepo.getById(id);
    if (usuario?.email === 'root@miapp.com') throw new Error('No se puede eliminar el usuario protegido');
    return UsuarioRepo.delete(id);
  }
}

module.exports = UsuarioService;
