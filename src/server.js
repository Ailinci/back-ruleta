const { app, startServer } = require('./app');
const connectDB = require('./config/database');

const main = async () => {
  try {
    // Conectar a la base de datos antes de iniciar el servidor
    await connectDB();
    
    // Iniciar el servidor
    const port = process.env.PORT || 4000;
    app.listen(port, "0.0.0.0", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

// Eliminar el bloque if (require.main === module) y startServer/stopServer de app.js
// y solo llamar a main() aquí.

if (require.main === module) {
  main();
}

module.exports = { app, main }; // Exportar `main` por si se necesita para otros scripts 