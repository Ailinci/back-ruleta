const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();

// Importar rutas
const usuariosRouter = require('./routes/api/usuarioRoutes');
const vistasRouter = require('./routes/views/usuarioView');
const propiedadesRouter = require('./routes/api/propiedadRoutes');
const propiedadesViewRouter = require('./routes/views/propiedadView');
const authRoutes = require('./routes/authRoutes');

// Importar middleware
const { verificarAutenticacion } = require('./middleware/authMiddleware');

const PORT = 5050;

// Configurar motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Configurar sesiones
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  }
}));

// Rutas de autenticación (públicas)
app.use('/auth', authRoutes);

// Ruta raíz (pública, pero muestra si está autenticado)
app.get('/', async (req, res) => {
  let usuario = null;
  
  // Verificar si hay un usuario autenticado (opcional)
  if (req.session?.token) {
    try {
      const jwt = require('jsonwebtoken');
      const UsuarioService = require('./services/usuarioService');
      
      const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
      usuario = await UsuarioService.obtenerPorId(decoded.id);
    } catch (error) {
      // Token inválido, limpiar sesión
      req.session.token = null;
    }
  }
  
  res.render('index', { 
    title: 'Alquilarte - Sistema de Gestión Inmobiliaria',
    usuario 
  });
});

// Rutas protegidas - API
app.use('/api/usuarios', verificarAutenticacion, usuariosRouter);
app.use('/api/propiedades', verificarAutenticacion, propiedadesRouter);

// Rutas protegidas - Vistas
app.use('/usuarios', verificarAutenticacion, vistasRouter);
app.use('/propiedades', verificarAutenticacion, propiedadesViewRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    mensaje: 'Algo salió mal!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).render('error', { 
    mensaje: 'Página no encontrada' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`🔐 Autenticación JWT configurada`);
  console.log(`📊 Base de datos: ${process.env.MONGO_URI ? 'MongoDB' : 'JSON files'}`);
});

module.exports = app;