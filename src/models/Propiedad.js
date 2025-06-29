const mongoose = require('mongoose');

const propiedadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de propiedad es obligatorio'],
    enum: ['Casa', 'Apartamento', 'Local Comercial', 'Terreno']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
  },
  estado: {
    type: String,
    required: true,
    enum: ['Disponible', 'Reservada', 'Alquilada', 'Inactiva'],
    default: 'Disponible',
  },
  id_propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, {
  collection: 'propiedades',
  timestamps: true // Añade createdAt y updatedAt
});

module.exports = mongoose.model('Propiedad', propiedadSchema);