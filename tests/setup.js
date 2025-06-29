const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

module.exports = async () => {
  console.log('\n🔧 Configurando servidor de base de datos en memoria...');

  // 1. Iniciar el servidor en memoria
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // 2. Establecer variables globales para que el teardown pueda detenerlo
  //    y para que los tests conozcan la URI.
  global.__MONGO_SERVER__ = mongoServer;
  process.env.MONGO_URI = mongoUri; // La URI para que los tests se conecten

  console.log(`✅ Servidor de BD en memoria iniciado en: ${mongoUri}`);
};