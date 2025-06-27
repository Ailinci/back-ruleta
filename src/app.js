require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const authMiddleware = require('./middlewares/authMiddleware');

// Configuración de Express
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB optimizada para testing
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Solo mostrar log cuando no esté en entorno de prueba
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ Conectado a MongoDB');
    }
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });

// Rutas públicas
app.use('/api/auth', require('./routes/api/authRoutes'));

// Rutas protegidas
app.use('/api/usuarios', authMiddleware.verificarToken, require('./routes/api/usuarioRoutes'));

// Ruta protegida de ejemplo para el dashboard
app.get('/api/protected/dashboard', authMiddleware.verificarToken, (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Acceso al dashboard autorizado',
    user: req.user // Asumiendo que el middleware añade el usuario
  });
});

// Manejo de rutas no encontradas
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Funciones para testing
const startServer = () => {
  return new Promise((resolve) => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      }
      resolve(server);
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      mongoose.connection.close();
      resolve();
    });
  });
};

// Exportación mejorada
module.exports = {
  app,
  server,
  startServer,
  stopServer
};