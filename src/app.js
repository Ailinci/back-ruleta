const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
const authRoutes = require('./routes/api/authRoutes');
const usuariosRouter = require('./routes/api/usuarioRoutes');
const vistasRouter = require('./routes/views/usuarioView');
const propiedadesRouter = require('./routes/api/propiedadRoutes');
const propiedadesViewRouter = require('./routes/views/propiedadView');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRouter);
app.use('/usuarios', vistasRouter);
app.use('/api/propiedades', propiedadesRouter);
app.use('/propiedades', propiedadesViewRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Alquilarte - Sistema de Gestión Inmobiliaria'
  });
});

// Conexión a MongoDB y levantar servidor SOLO UNA VEZ
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));
