module.exports = async () => {
    console.log('\n🧹 Deteniendo servidor de base de datos en memoria...');
    
    // Detener MongoDB en memoria
    if (global.__MONGO_SERVER__) {
      await global.__MONGO_SERVER__.stop();
      console.log('✅ Servidor de BD en memoria detenido.');
    }
  };