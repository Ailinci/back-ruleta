const { v4: uuidv4 } = require('uuid');
const PropiedadRepo = require('../repositories/propiedadRepositoryJSON');
const Propiedad = require('../models/Propiedad');

class PropiedadService {
  static crearPropiedad({ titulo, descripcion, tipo, direccion, precio, id_propietario, estado }) {
    // Validaciones
    if (!titulo || !tipo || !direccion || !precio || !id_propietario) {
      throw new Error('Faltan datos obligatorios para crear la propiedad');
    }

    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      throw new Error('El precio debe ser un número positivo');
    }

    // Crear nueva propiedad
    const nuevaPropiedad = new Propiedad({
      id: uuidv4(),
      titulo,
      descripcion,
      tipo,
      direccion,
      precio: parseFloat(precio),
      estado: estado || Propiedad.ESTADOS.DISPONIBLE,
      id_propietario
    });

    return PropiedadRepo.save(nuevaPropiedad);
  }

  static listarPropiedades(filtros = {}) {
    let propiedades = PropiedadRepo.getAll();

    // Aplicar filtros si existen
    if (filtros.estado) {
      propiedades = propiedades.filter(p => p.estado === filtros.estado);
    }

    if (filtros.tipo) {
      propiedades = propiedades.filter(p => p.tipo === filtros.tipo);
    }

    if (filtros.id_propietario) {
      propiedades = propiedades.filter(p => p.id_propietario === filtros.id_propietario);
    }

    if (filtros.precioMin) {
      propiedades = propiedades.filter(p => p.precio >= parseFloat(filtros.precioMin));
    }

    if (filtros.precioMax) {
      propiedades = propiedades.filter(p => p.precio <= parseFloat(filtros.precioMax));
    }

    return propiedades;
  }

  static obtenerPorId(id) {
    const propiedad = PropiedadRepo.getById(id);
    if (!propiedad) return null;
    
    return new Propiedad(propiedad);
  }

  static actualizarPropiedad(id, datos) {
    // Verificar que la propiedad existe
    const propiedad = this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    // Validar precio si se está actualizando
    if (datos.precio !== undefined) {
      if (isNaN(parseFloat(datos.precio)) || parseFloat(datos.precio) <= 0) {
        throw new Error('El precio debe ser un número positivo');
      }
      datos.precio = parseFloat(datos.precio);
    }

    // Validar estado si se está actualizando
    if (datos.estado !== undefined) {
      try {
        propiedad.cambiarEstado(datos.estado);
        datos.estado = propiedad.estado;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    return PropiedadRepo.update(id, datos);
  }

  static cambiarEstadoPropiedad(id, nuevoEstado) {
    const propiedad = this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    try {
      propiedad.cambiarEstado(nuevoEstado);
      return PropiedadRepo.update(id, { estado: propiedad.estado });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static eliminarPropiedad(id) {
    const propiedad = this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    // No permitir eliminar propiedades alquiladas
    if (propiedad.estado === Propiedad.ESTADOS.ALQUILADA) {
      throw new Error('No se puede eliminar una propiedad que está alquilada');
    }

    return PropiedadRepo.delete(id);
  }

  // Métodos de utilidad para la gestión de propiedades
  static getPropiedadesDisponibles() {
    return this.listarPropiedades({ estado: Propiedad.ESTADOS.DISPONIBLE });
  }

  static getPropiedadesPorPropietario(id_propietario) {
    return this.listarPropiedades({ id_propietario });
  }
}

module.exports = PropiedadService;