const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
const { startServer, stopServer } = require('../src/app');
const Usuario = require('../src/models/Usuario');

describe('WebSocket Integration', () => {
  let server;
  let clientSocket;
  let authToken;

  beforeAll(async () => {
    // 1. Iniciar servidor con puerto dinámico
    server = await startServer();
    
    // 2. Usuario de prueba con contraseña segura
    const user = await Usuario.create({
      nombre: 'Socket User',
      email: `socket-${Date.now()}@test.com`, // Email único
      password: 'S0cketP@ss!123'
    });

    // 3. Token JWT con expiración
    authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }, 10000); // Aumentar timeout para beforeAll

  afterAll(async () => {
    // 1. Desconectar cliente si existe
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    
    // 2. Limpiar base de datos
    await Usuario.deleteMany({});
    
    // 3. Detener servidor
    await stopServer();
  }, 10000);

  test('Conexión autenticada', (done) => {
    clientSocket = io.connect(`http://localhost:${process.env.PORT}`, {
      auth: { token: authToken },
      reconnection: false,
      timeout: 5000
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBeTruthy();
      clientSocket.disconnect();
      done();
    });

    clientSocket.on('connect_error', (err) => {
      done.fail(`Error de conexión: ${err.message}`);
    });
  });

  test('Evento nuevaPropiedad', (done) => {
    clientSocket = io.connect(`http://localhost:${process.env.PORT}`, {
      auth: { token: authToken },
      reconnection: false
    });

    const testData = {
      titulo: 'Casa de prueba',
      precio: 1000,
      timestamp: Date.now()
    };

    clientSocket.on('propiedadCreada', (data) => {
      try {
        expect(data).toMatchObject({
          titulo: testData.titulo,
          precio: testData.precio
        });
        done();
      } catch (err) {
        done.fail(err);
      } finally {
        clientSocket.disconnect();
      }
    });

    clientSocket.emit('nuevaPropiedad', testData);
  });
});