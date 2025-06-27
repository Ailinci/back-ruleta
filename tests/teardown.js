module.exports = async () => {
    console.log('\n🧹 Limpiando entorno de pruebas...');
    
    // 1. Cerrar conexión de Mongoose
    if (global.__MONGO_CONNECTION__) {
      await global.__MONGO_CONNECTION__.close();
    }
  
    // 2. Detener MongoDB en memoria
    if (global.__MONGO_SERVER__) {
      await global.__MONGO_SERVER__.stop();
    }
  
    // 3. Limpiar variables globales
    global.__MONGO_SERVER__ = null;
    global.__MONGO_CONNECTION__ = null;
  
    console.log('✅ Limpieza completada\n');
  };