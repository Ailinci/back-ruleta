const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  crearUsuario(req, res) {
    try {
      const nuevo = UsuarioService.crearUsuario(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  obtenerTodos(req, res) {
    const { email } = req.query;

    if (email) {
      const usuario = UsuarioService.obtenerPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json(usuario);
    }

    const usuarios = UsuarioService.listarUsuarios();
    res.json(usuarios);
  },

  obtenerPorId(req, res) {
    const usuario = UsuarioService.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  },

  eliminar(req, res) {
    try {
      const eliminado = UsuarioService.eliminarUsuario(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ mensaje: 'Usuario eliminado', eliminado });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // etc...
};

module.exports = UsuarioController;
