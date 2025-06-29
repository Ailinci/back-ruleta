const UsuarioRepository = require('../repositories/usuarioRepositoryMONGO');
const Usuario = require('../models/Usuario'); // Importar el modelo para acceder al schema

const UsuarioViewController = {
  async renderLista(req, res, next) {
    try {
      const usuarios = await UsuarioRepository.getAll(); // Suponiendo que existe un getAll
      res.render('usuarios/index', { usuarios });
    } catch (err) {
      next(err);
    }
  },

  renderFormularioNuevo(req, res) {
    res.render('usuarios/formulario', { 
      usuario: {}, 
      error: null,
      roles: Usuario.schema.path('rol').enumValues
    });
  },

  async renderDetalle(req, res, next) {
    try {
      const usuario = await UsuarioRepository.getById(req.params.id);
      if (!usuario) {
          const err = new Error('Usuario no encontrado');
          err.status = 404;
          return next(err);
      }
      res.render('usuarios/detalle', { usuario });
    } catch (err) {
      next(err);
    }
  },

  async renderFormularioEditar(req, res, next) {
    try {
      const usuario = await UsuarioRepository.getById(req.params.id);
      if (!usuario) {
        const err = new Error('Usuario no encontrado');
        err.status = 404;
        return next(err);
      }
      res.render('usuarios/editar', { usuario, error: null });
    } catch (err) {
      next(err);
    }
  },

  async crearDesdeFormulario(req, res, next) {
    try {
      await UsuarioRepository.save(req.body);
      res.redirect('/usuarios');
    } catch (err) {
      res.status(400).render('usuarios/formulario', {
        usuario: req.body,
        error: err.message,
        roles: Usuario.schema.path('rol').enumValues
      });
    }
  },

  async actualizarDesdeFormulario(req, res, next) {
    try {
        await UsuarioRepository.updateUser(req.params.id, req.body);
        res.redirect(`/usuarios/${req.params.id}`);
    } catch (err) {
        res.status(400).render('usuarios/editar', {
            usuario: { _id: req.params.id, ...req.body },
            error: err.message,
            roles: ['admin', 'secretary', 'agent']
        });
    }
  },

  async eliminarUsuario(req, res, next) {
    try {
        await UsuarioRepository.delete(req.params.id);
        res.redirect('/usuarios');
    } catch(err) {
        next(err);
    }
  }
};

module.exports = UsuarioViewController;
