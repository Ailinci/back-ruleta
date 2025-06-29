require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const connectDB = require('./config/database');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/api/authRoutes');
const usuarioRoutes = require('./routes/api/usuarioRoutes');
const propiedadRoutes = require('./routes/api/propiedadRoutes');

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware global para cargar datos de usuario en las vistas
app.use(authMiddleware.cargarUsuario);

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas de Vistas
const propiedadViewRoutes = require('./routes/views/propiedadView');
const usuarioViewRoutes = require('./routes/views/usuarioView');
const authViewRoutes = require('./routes/views/authView');

// Ruta principal (protegida)
app.get('/', authMiddleware.requireAuth, (req, res) => {
  res.render('index', { title: 'Bienvenido' });
});

app.use('/propiedades', authMiddleware.requireAuth, authMiddleware.requireRole('admin', 'agent'), propiedadViewRoutes);
app.use('/usuarios', authMiddleware.requireAuth, authMiddleware.requireRole('admin', 'secretary'), usuarioViewRoutes);
app.use('/auth', authViewRoutes);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/propiedades', propiedadRoutes);

// Ruta protegida de ejemplo para el dashboard (para testing)
app.get('/api/protected/dashboard', authMiddleware.verificarToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Acceso al dashboard autorizado',
    user: req.user
  });
});

// Middleware para manejo de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

let server;

const startServer = (port = process.env.PORT || 4000) => {
  return new Promise((resolve) => {
    server = app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      }
      resolve(server);
    });
  });
};

const stopServer = () => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close(async () => {
        await mongoose.connection.close();
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Iniciar el servidor solo si el script se ejecuta directamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, stopServer };