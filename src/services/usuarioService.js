const { v4: uuidv4 } = require('uuid');
// const UsuarioRepo = require('../repositories/usuarioRepositoryJSON'); // or usuarioRepositoryMONGO
const UsuarioRepo = require('../repositories/usuarioRepositoryMONGO'); // or usuarioRepositoryMONGO

class UsuarioService {
  static async crearUsuario({ nombre, rol, email }) {
    if (!nombre || !rol || !email) throw new Error('Faltan datos');
    if (await UsuarioRepo.existsByEmail(email)) throw new Error('Email ya registrado');

    const nuevoUsuario = { id: uuidv4(), nombre, rol, email };
    return await UsuarioRepo.save(nuevoUsuario);
  }

  static async listarUsuarios() {
    return await UsuarioRepo.getAll();
  }

  static async obtenerPorId(id) {
    return await UsuarioRepo.getById(id);
  }

  static async obtenerPorEmail(email) {
    return await UsuarioRepo.getByEmail(email);
  }

  static async actualizarUsuario(id, datos) {
    if (datos.email) {
      const existente = await UsuarioRepo.getByEmail(datos.email);
      if (existente && existente.id !== id) throw new Error('Email en uso');
    }
    return await UsuarioRepo.update(id, datos);
  }

  static async eliminarUsuario(id) {
    const usuario = await UsuarioRepo.getById(id);
    if (usuario?.email === 'root@miapp.com') throw new Error('No se puede eliminar el usuario protegido');
    return await UsuarioRepo.delete(id);
  }
}

module.exports = UsuarioService;
