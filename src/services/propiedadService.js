const { v4: uuidv4 } = require('uuid');
//const PropiedadRepo = require('../repositories/propiedadRepositoryJSON');
const PropiedadRepo = require('../repositories/propiedadRepositoryMONGO');
const Propiedad = require('../models/Propiedad');

class PropiedadService {
  static async crearPropiedad({ titulo, descripcion, tipo, direccion, precio, id_propietario, estado }) {
    if (!titulo || !tipo || !direccion || !precio || !id_propietario) {
      throw new Error('Faltan datos obligatorios para crear la propiedad');
    }

    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      throw new Error('El precio debe ser un número positivo');
    }

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

    return await PropiedadRepo.save(nuevaPropiedad);
  }

  static async listarPropiedades(filtros = {}) {
    let propiedades = await PropiedadRepo.getAll();

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

  static async obtenerPorId(id) {
    const propiedad = await PropiedadRepo.getById(id);
    if (!propiedad) return null;
    
    return new Propiedad(propiedad);
  }

  static async actualizarPropiedad(id, datos) {
    const propiedad = await this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    if (datos.precio !== undefined) {
      if (isNaN(parseFloat(datos.precio)) || parseFloat(datos.precio) <= 0) {
        throw new Error('El precio debe ser un número positivo');
      }
      datos.precio = parseFloat(datos.precio);
    }

    if (datos.estado !== undefined) {
      try {
        propiedad.cambiarEstado(datos.estado);
        datos.estado = propiedad.estado;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    return await PropiedadRepo.update(id, datos);
  }

  static async cambiarEstadoPropiedad(id, nuevoEstado) {
    const propiedad = await this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    try {
      propiedad.cambiarEstado(nuevoEstado);
      return await PropiedadRepo.update(id, { estado: propiedad.estado });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async eliminarPropiedad(id) {
    const propiedad = await this.obtenerPorId(id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    if (propiedad.estado === Propiedad.ESTADOS.ALQUILADA) {
      throw new Error('No se puede eliminar una propiedad que está alquilada');
    }

    return await PropiedadRepo.delete(id);
  }

  static async getPropiedadesDisponibles() {
    return await this.listarPropiedades({ estado: Propiedad.ESTADOS.DISPONIBLE });
  }

  static async getPropiedadesPorPropietario(id_propietario) {
    return await this.listarPropiedades({ id_propietario });
  }
}

module.exports = PropiedadService;
