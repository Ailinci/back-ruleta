const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  async renderLista(req, res) {
    try {
      const usuarios = await UsuarioService.listarUsuarios();
      res.render('usuarios/index', { usuarios });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al cargar usuarios' });
    }
  },

  renderFormularioNuevo(req, res) {
    res.render('usuarios/formulario');
  },

  async renderDetalle(req, res) {
    try {
      const usuario = await UsuarioService.obtenerPorId(req.params.id);
      if (!usuario) return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
      res.render('usuarios/detalle', { usuario });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al obtener el usuario' });
    }
  },

  async renderFormularioEditar(req, res) {
    try {
      const usuario = await UsuarioService.obtenerPorId(req.params.id);
      if (!usuario) return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
      res.render('usuarios/editar', { usuario });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al obtener el usuario' });
    }
  },

  async crearDesdeFormulario(req, res) {
    try {
      await UsuarioService.crearUsuario(req.body);
      res.redirect('/usuarios');
    } catch (err) {
      res.status(400).render('usuarios/formulario', {
        error: err.message
      });
    }
  }
};

module.exports = UsuarioController;
