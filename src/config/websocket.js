const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: '*', // Ajusta en producción
      methods: ['GET', 'POST'],
    },
  });

  // Middleware de autenticación JWT para sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        throw new Error('Token no proporcionado');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      socket.user = usuario;
      next();
    } catch (error) {
      next(new Error('Autenticación fallida'));
    }
  });

  // Eventos de conexión
  io.on('connection', (socket) => {
    console.log(`⚡: ${socket.user.email} conectado`);

    // Escuchar eventos personalizados
    socket.on('nuevaPropiedad', async (data) => {
      // Validar y guardar en DB si es necesario
      io.emit('propiedadCreada', { 
        ...data, 
        creador: socket.user.email 
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔥: ${socket.user.email} desconectado`);
    });
  });

  return io;
};