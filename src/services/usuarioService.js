const { v4: uuidv4 } = require('uuid');
const UsuarioRepo = require('../repositories/usuarioRepositoryMONGO');
const Usuario = require('../models/Usuario');

class UsuarioService {
  static async crearUsuario({ nombre, rol, email }) {
    if (!nombre || !rol || !email) throw new Error('Faltan datos');
    if (await UsuarioRepo.existsByEmail(email)) throw new Error('Email ya registrado');

    const nuevoUsuario = { id: uuidv4(), nombre, rol, email };
    return await UsuarioRepo.save(nuevoUsuario);
  }

  static async crearUsuarioConPassword({ nombre, rol, email, password }) {
    if (!nombre || !rol || !email || !password) throw new Error('Faltan datos obligatorios');
    if (await UsuarioRepo.existsByEmail(email)) throw new Error('Email ya registrado');

    const nuevoUsuario = { 
      id: uuidv4(), 
      nombre, 
      rol, 
      email, 
      password 
    };
    
    const usuarioGuardado = await UsuarioRepo.save(nuevoUsuario);
    
    const { password: _, ...usuarioSinPassword } = usuarioGuardado;
    return usuarioSinPassword;
  }

  static async listarUsuarios() {
    const usuarios = await UsuarioRepo.getAll();
    return usuarios.map(usuario => new Usuario(usuario).toJSON());
  }

  static async obtenerPorId(id) {
    const usuario = await UsuarioRepo.getById(id);
    if (!usuario) return null;
    
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  static async obtenerPorEmail(email) {
    return await UsuarioRepo.getByEmail(email);
  }

  static async actualizarUsuario(id, datos) {
    if (datos.email) {
      const existente = await UsuarioRepo.getByEmail(datos.email);
      if (existente && existente.id !== id) throw new Error('Email en uso');
    }

    if (datos.password) {
      const usuario = new Usuario(datos);
      await usuario.hashPassword();
      datos.password = usuario.password;
    }

    return await UsuarioRepo.update(id, datos);
  }

  static async eliminarUsuario(id) {
    const usuario = await UsuarioRepo.getById(id);
    if (usuario?.email === 'root@backendapp.com') throw new Error('No se puede eliminar el usuario protegido');
    return await UsuarioRepo.delete(id);
  }

  static async cambiarPassword(id, passwordActual, nuevaPassword) {
    const usuario = await UsuarioRepo.getById(id);
    if (!usuario) throw new Error('Usuario no encontrado');

    const usuarioCompleto = new Usuario(usuario);
    const passwordValido = await usuarioCompleto.comparePassword(passwordActual);
    
    if (!passwordValido) throw new Error('Password actual incorrecto');

    const nuevoUsuario = new Usuario({ password: nuevaPassword });
    await nuevoUsuario.hashPassword();

    return await UsuarioRepo.update(id, { password: nuevoUsuario.password });
  }
}

module.exports = UsuarioService;