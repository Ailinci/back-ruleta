// app.js
const express = require('express');
const app = express();
const usuariosRouter = require('./routes/api/usuarioRoutes'); // Importar rutas de usuarios
const vistasRouter = require('./routes/views/usuarioView'); // Importar rutas de vistas

const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const PORT = 5050;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Middleware para que Express pueda leer datos enviados desde un formulario HTML
app.use(express.urlencoded({ extended: true }));

// Montar el router de usuarios en la ruta /usuarios
app.use('/api/usuarios', usuariosRouter);

app.use('/usuarios', vistasRouter);

// Ruta raíz opcional, para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
