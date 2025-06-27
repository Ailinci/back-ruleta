const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  async crearUsuario(req, res) {
    try {
      const nuevo = await UsuarioService.crearUsuario(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const { email } = req.query;

      if (email) {
        const usuario = await UsuarioService.obtenerPorEmail(email);
        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(usuario);
      }

      const usuarios = await UsuarioService.listarUsuarios();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const usuario = await UsuarioService.obtenerPorId(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: 'Error al buscar el usuario' });
    }
  },

  async eliminar(req, res) {
    try {
      const eliminado = await UsuarioService.eliminarUsuario(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ mensaje: 'Usuario eliminado', eliminado });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = UsuarioController;
