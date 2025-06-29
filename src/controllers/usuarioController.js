const UsuarioRepository = require('../repositories/usuarioRepositoryMONGO');

const UsuarioController = {
  async obtenerTodos(req, res, next) {
    try {
      const usuarios = await UsuarioRepository.getAll();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const usuario = await UsuarioRepository.getById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async crearUsuario(req, res, next) {
    try {
      const nuevoUsuario = await UsuarioRepository.save(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (err) {
      next(err);
    }
  },

  async actualizarUsuario(req, res, next) {
    try {
      const usuarioActualizado = await UsuarioRepository.updateUser(req.params.id, req.body);
      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuarioActualizado);
    } catch (err) {
      next(err);
    }
  },

  async eliminarUsuario(req, res, next) {
    try {
      const usuarioEliminado = await UsuarioRepository.delete(req.params.id);
      if (!usuarioEliminado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(204).send(); // No content
    } catch (err) {
      next(err);
    }
  }
};

module.exports = UsuarioController;