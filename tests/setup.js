const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

module.exports = async () => {
  console.log('\n🔧 Configurando entorno de pruebas...');

  // 1. MongoDB en memoria con configuración optimizada
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'test-db',
      port: 27017,
      storageEngine: 'wiredTiger'
    },
    binary: {
      version: '6.0.8'
    }
  });

  const mongoUri = mongoServer.getUri();
  
  // 2. Configuración de variables de entorno seguras
  process.env = {
    ...process.env,
    MONGO_URI: mongoUri,
    JWT_SECRET: 'test-secret-' + Math.random().toString(36).substring(7),
    NODE_ENV: 'test',
    PORT: '5050' // Puerto fijo para pruebas
  };

  // 3. Conexión mejorada con manejo de errores
  mongoose.set('strictQuery', false);
  
  try {
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });
    console.log('✅ Conexión a MongoDB establecida');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    await mongoServer.stop();
    process.exit(1);
  }

  // 4. Referencias globales para limpieza
  global.__MONGO_SERVER__ = mongoServer;
  global.__MONGO_CONNECTION__ = mongoose.connection;
};