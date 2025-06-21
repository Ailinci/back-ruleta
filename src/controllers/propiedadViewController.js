const PropiedadService = require('../services/propiedadService');
const Propiedad = require('../models/Propiedad');

const PropiedadViewController = {
  async renderLista(req, res) {
    try {
      const { estado, tipo, id_propietario, precioMin, precioMax } = req.query;
      const filtros = {};

      if (estado) filtros.estado = estado;
      if (tipo) filtros.tipo = tipo;
      if (id_propietario) filtros.id_propietario = id_propietario;
      if (precioMin) filtros.precioMin = precioMin;
      if (precioMax) filtros.precioMax = precioMax;

      const propiedades = await PropiedadService.listarPropiedades(filtros);

      res.render('propiedades/index', { 
        propiedades,
        filtros,
        estados: Object.values(Propiedad.ESTADOS),
        tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina']
      });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al cargar propiedades' });
    }
  },

  renderFormularioNuevo(req, res) {
    res.render('propiedades/formulario', {
      propiedad: {},
      estados: Object.values(Propiedad.ESTADOS),
      tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
      error: null
    });
  },

  async renderDetalle(req, res) {
    try {
      const propiedad = await PropiedadService.obtenerPorId(req.params.id);
      if (!propiedad) {
        return res.status(404).render('error', { mensaje: 'Propiedad no encontrada' });
      }
      res.render('propiedades/detalle', { propiedad });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al mostrar la propiedad' });
    }
  },

  async renderFormularioEditar(req, res) {
    try {
      const propiedad = await PropiedadService.obtenerPorId(req.params.id);
      if (!propiedad) {
        return res.status(404).render('error', { mensaje: 'Propiedad no encontrada' });
      }

      res.render('propiedades/formulario', {
        propiedad,
        estados: Object.values(Propiedad.ESTADOS),
        tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
        error: null
      });
    } catch (err) {
      res.status(500).render('error', { mensaje: 'Error al cargar el formulario' });
    }
  },

  async crearDesdeFormulario(req, res) {
    try {
      await PropiedadService.crearPropiedad(req.body);
      res.redirect('/propiedades');
    } catch (err) {
      res.status(400).render('propiedades/formulario', {
        propiedad: req.body,
        estados: Object.values(Propiedad.ESTADOS),
        tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
        error: err.message
      });
    }
  },

  async actualizarDesdeFormulario(req, res) {
    try {
      await PropiedadService.actualizarPropiedad(req.params.id, req.body);
      res.redirect(`/propiedades/${req.params.id}`);
    } catch (err) {
      res.status(400).render('propiedades/formulario', {
        propiedad: { id: req.params.id, ...req.body },
        estados: Object.values(Propiedad.ESTADOS),
        tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
        error: err.message
      });
    }
  }
};

module.exports = PropiedadViewController;
