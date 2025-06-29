// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');
const connectDB = require('./src/config/database');

const users = [
  {
    nombre: 'Admin User',
    email: 'admin@example.com',
    password: 'Pass123123',
    rol: 'admin'
  },
  {
    nombre: 'Secretary User',
    email: 'secretaria@secretaria.com',
    password: 'Pass123123',
    rol: 'secretary'
  },
  {
    nombre: 'Agent User',
    email: 'agente@agente.com',
    password: 'Pass123123',
    rol: 'agent'
  }
];

const seedDB = async () => {
  try {
    // 1. Conectar a la base de datos
    await connectDB();
    console.log('🔌 Conectado a la base de datos para el seeder.');

    // 2. Limpiar la colección de usuarios existente
    await Usuario.deleteMany({});
    console.log('🧹 Colección de usuarios limpiada.');

    // 3. Insertar los nuevos usuarios
    // El middleware 'pre-save' en el modelo se encargará de hashear las contraseñas
    await Usuario.create(users);
    console.log('🌱 Usuarios insertados correctamente.');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    // 4. Desconectar de la base de datos
    await mongoose.disconnect();
    console.log('🔌 Desconectado de la base de datos.');
  }
};

seedDB(); 