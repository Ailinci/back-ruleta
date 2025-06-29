// src/config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Solo mostrar log cuando no esté en entorno de prueba
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ Conexión a MongoDB (Mongoose) establecida');
    }
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB con Mongoose:', error.message);
    // Salir del proceso con código de error
    process.exit(1);
  }
};

module.exports = connectDB; 