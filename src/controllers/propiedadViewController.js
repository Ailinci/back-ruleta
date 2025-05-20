const PropiedadService = require('../services/propiedadService');
const Propiedad = require('../models/Propiedad');

const PropiedadViewController = {
  renderLista(req, res) {
    const { estado, tipo, id_propietario, precioMin, precioMax } = req.query;
    const filtros = {};

    if (estado) filtros.estado = estado;
    if (tipo) filtros.tipo = tipo;
    if (id_propietario) filtros.id_propietario = id_propietario;
    if (precioMin) filtros.precioMin = precioMin;
    if (precioMax) filtros.precioMax = precioMax;

    const propiedades = PropiedadService.listarPropiedades(filtros);
    res.render('propiedades/index', { 
      propiedades,
      filtros,
      estados: Object.values(Propiedad.ESTADOS),
      tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina']
    });
  },

  // Renderizar formulario para crear nueva propiedad
  renderFormularioNuevo(req, res) {
    res.render('propiedades/formulario', {
      propiedad: {},
      estados: Object.values(Propiedad.ESTADOS),
      tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
      error: null
    });
  },

  // Renderizar vista de detalle de una propiedad
  renderDetalle(req, res) {
    const propiedad = PropiedadService.obtenerPorId(req.params.id);
    if (!propiedad) {
      return res.status(404).render('error', { mensaje: 'Propiedad no encontrada' });
    }
    res.render('propiedades/detalle', { propiedad });
  },

  // Renderizar formulario para editar una propiedad
  renderFormularioEditar(req, res) {
    const propiedad = PropiedadService.obtenerPorId(req.params.id);
    if (!propiedad) {
      return res.status(404).render('error', { mensaje: 'Propiedad no encontrada' });
    }
    res.render('propiedades/formulario', {
      propiedad,
      estados: Object.values(Propiedad.ESTADOS),
      tiposPropiedades: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina'],
      error: null
    });
  },

  // Procesar la creación de una propiedad desde el formulario
  crearDesdeFormulario(req, res) {
    try {
      const nuevaPropiedad = PropiedadService.crearPropiedad(req.body);
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

  // Procesar la actualización de una propiedad desde el formulario
  actualizarDesdeFormulario(req, res) {
    try {
      const propiedadActualizada = PropiedadService.actualizarPropiedad(req.params.id, req.body);
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