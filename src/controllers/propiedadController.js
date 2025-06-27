const PropiedadService = require('../services/propiedadService');

const PropiedadController = {
  async crearPropiedad(req, res) {
    try {
      const propiedad = await PropiedadService.crearPropiedad(req.body);
      res.status(201).json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async obtenerTodas(req, res) {
    try {
      const { estado, tipo, id_propietario, precioMin, precioMax } = req.query;
      const filtros = {};

      if (estado) filtros.estado = estado;
      if (tipo) filtros.tipo = tipo;
      if (id_propietario) filtros.id_propietario = id_propietario;
      if (precioMin) filtros.precioMin = precioMin;
      if (precioMax) filtros.precioMax = precioMax;

      const propiedades = await PropiedadService.listarPropiedades(filtros);
      res.json(propiedades);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener propiedades' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const propiedad = await PropiedadService.obtenerPorId(req.params.id);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      res.json(propiedad);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener propiedad' });
    }
  },

  async actualizar(req, res) {
    try {
      const propiedad = await PropiedadService.actualizarPropiedad(req.params.id, req.body);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      res.json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
      }

      const propiedad = await PropiedadService.cambiarEstadoPropiedad(req.params.id, estado);
      res.json(propiedad);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async eliminar(req, res) {
    try {
      const eliminada = await PropiedadService.eliminarPropiedad(req.params.id);
      res.json({ mensaje: 'Propiedad eliminada correctamente', propiedad: eliminada });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PropiedadController;
