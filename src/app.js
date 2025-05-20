const express = require('express');
const app = express();
const usuariosRouter = require('./routes/api/usuarioRoutes'); // Importar rutas de usuarios
const vistasRouter = require('./routes/views/usuarioView'); // Importar rutas de vistas

const propiedadesRouter = require('./routes/api/propiedadRoutes');
const propiedadesViewRouter = require('./routes/views/propiedadView');

const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const PORT = 5050;

// Middleware para parsear JSON en las peticiones
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para que Express pueda leer datos enviados desde un formulario HTML
app.use(express.urlencoded({ extended: true }));

// Montar el router de usuarios en la ruta /usuarios
app.use('/api/usuarios', usuariosRouter);

app.use('/usuarios', vistasRouter);

// /propiedades
app.use('/api/propiedades', propiedadesRouter);
app.use('/propiedades', propiedadesViewRouter);

// Ruta raíz opcional, para probar que el servidor funciona
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Alquilarte - Sistema de Gestión Inmobiliaria' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
