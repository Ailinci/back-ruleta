const Propiedad = require('../models/Propiedad');

const PropiedadRepositoryMONGO = {
  async getAll() {
    return Propiedad.find();
  },

  async getById(id) {
    return Propiedad.findById(id);
  },

  async getByPropietario(id_propietario) {
    return Propiedad.find({ id_propietario });
  },

  async getByEstado(estado) {
    return Propiedad.find({ estado });
  },

  async save(propiedadData) {
    const nuevaPropiedad = new Propiedad(propiedadData);
    return nuevaPropiedad.save();
  },

  async update(id, datos) {
    return Propiedad.findByIdAndUpdate(id, datos, { new: true });
  },

  async delete(id) {
    return Propiedad.findByIdAndDelete(id);
  }
};

module.exports = PropiedadRepositoryMONGO;
