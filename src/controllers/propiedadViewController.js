const PropiedadRepository = require('../repositories/propiedadRepositoryMONGO');
const Propiedad = require('../models/Propiedad'); // El modelo de Mongoose

const PropiedadViewController = {
  async renderLista(req, res, next) {
    try {
      const propiedades = await PropiedadRepository.getAll();
      res.render('propiedades/index', {
        propiedades,
        estados: Propiedad.schema.path('estado').enumValues,
        tiposPropiedades: Propiedad.schema.path('tipo').enumValues
      });
    } catch (err) {
      next(err);
    }
  },

  renderFormularioNuevo(req, res) {
    res.render('propiedades/formulario', {
      propiedad: {},
      estados: Propiedad.schema.path('estado').enumValues,
      tiposPropiedades: Propiedad.schema.path('tipo').enumValues,
      error: null
    });
  },

  async renderDetalle(req, res, next) {
    try {
      const propiedad = await PropiedadRepository.getById(req.params.id);
      if (!propiedad) {
        const err = new Error('Propiedad no encontrada');
        err.status = 404;
        return next(err);
      }
      res.render('propiedades/detalle', { propiedad });
    } catch (err) {
      next(err);
    }
  },

  async renderFormularioEditar(req, res, next) {
    try {
      const propiedad = await PropiedadRepository.getById(req.params.id);
      if (!propiedad) {
        const err = new Error('Propiedad no encontrada');
        err.status = 404;
        return next(err);
      }

      res.render('propiedades/formulario', {
        propiedad,
        estados: Propiedad.schema.path('estado').enumValues,
        tiposPropiedades: Propiedad.schema.path('tipo').enumValues,
        error: null
      });
    } catch (err) {
      next(err);
    }
  },

  async crearDesdeFormulario(req, res, next) {
    try {
      // Asegúrate de que el propietario esté asignado. 
      // Aquí asumimos que el id del usuario logueado está en req.user._id
      const propiedadData = { ...req.body, id_propietario: req.user._id };
      await PropiedadRepository.save(propiedadData);
      res.redirect('/propiedades');
    } catch (err) {
      res.status(400).render('propiedades/formulario', {
        propiedad: req.body,
        estados: Propiedad.schema.path('estado').enumValues,
        tiposPropiedades: Propiedad.schema.path('tipo').enumValues,
        error: err.message
      });
    }
  },

  async actualizarDesdeFormulario(req, res, next) {
    try {
      await PropiedadRepository.update(req.params.id, req.body);
      res.redirect(`/propiedades/${req.params.id}`);
    } catch (err) {
      res.status(400).render('propiedades/formulario', {
        propiedad: { _id: req.params.id, ...req.body },
        estados: Propiedad.schema.path('estado').enumValues,
        tiposPropiedades: Propiedad.schema.path('tipo').enumValues,
        error: err.message
      });
    }
  },

  async eliminarPropiedad(req, res, next) {
    try {
      await PropiedadRepository.delete(req.params.id);
      res.redirect('/propiedades');
    } catch(err) {
      next(err);
    }
  }
};

module.exports = PropiedadViewController;
