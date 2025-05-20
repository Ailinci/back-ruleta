const PropiedadService = require('../services/propiedadService');

const PropiedadController = {
  // Crear una nueva propiedad
  crearPropiedad(req, res) {
    try {
      const propiedad = PropiedadService.crearPropiedad(req.body);
      res.status(201).json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Obtener todas las propiedades (con filtros opcionales)
  obtenerTodas(req, res) {
    const { estado, tipo, id_propietario, precioMin, precioMax } = req.query;
    const filtros = {};

    if (estado) filtros.estado = estado;
    if (tipo) filtros.tipo = tipo;
    if (id_propietario) filtros.id_propietario = id_propietario;
    if (precioMin) filtros.precioMin = precioMin;
    if (precioMax) filtros.precioMax = precioMax;

    const propiedades = PropiedadService.listarPropiedades(filtros);
    res.json(propiedades);
  },

  // Obtener propiedad por ID
  obtenerPorId(req, res) {
    const propiedad = PropiedadService.obtenerPorId(req.params.id);
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    res.json(propiedad);
  },

  // Actualizar una propiedad
  actualizar(req, res) {
    try {
      const propiedad = PropiedadService.actualizarPropiedad(req.params.id, req.body);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      res.json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cambiar el estado de una propiedad
  cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
      }

      const propiedad = PropiedadService.cambiarEstadoPropiedad(req.params.id, estado);
      res.json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Eliminar una propiedad
  eliminar(req, res) {
    try {
      const eliminada = PropiedadService.eliminarPropiedad(req.params.id);
      res.json({ mensaje: 'Propiedad eliminada correctamente', propiedad: eliminada });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PropiedadController;