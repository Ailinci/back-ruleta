// app.js
const express = require('express');
const app = express();
const usuariosRouter = require('./routes/usuarios'); // Importar rutas de usuarios

const PORT = 5050;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Montar el router de usuarios en la ruta /usuarios
app.use('/usuarios', usuariosRouter);

// Ruta raíz opcional, para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
