const { app } = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const jwt = require('jsonwebtoken');

describe('Auth Middleware Tests', () => {
  let testToken;
  let adminToken;
  let secretaryToken;

  beforeAll(async () => {
    // Conectarse a la base de datos de prueba en memoria
    await mongoose.connect(process.env.MONGO_URI);

    // Limpiar la colección antes de crear nuevos usuarios de prueba
    await Usuario.deleteMany({});

    // Crear usuario de prueba (agente)
    const user = await Usuario.create({
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      rol: 'agent'
    });

    // Crear admin de prueba
    const admin = await Usuario.create({
      nombre: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      rol: 'admin'
    });

    // Crear secretario de prueba
    const secretary = await Usuario.create({
      nombre: 'Secretary User',
      email: 'secretary@example.com',
      password: 'Secretary123!',
      rol: 'secretary'
    });

    // Generar tokens
    testToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    secretaryToken = jwt.sign(
      { id: secretary._id, email: secretary.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Desconectar de la base de datos después de las pruebas
    await mongoose.disconnect();
  });

  describe('Rutas protegidas', () => {
    test('GET /api/usuarios/perfil sin token debe fallar', async () => {
      const response = await request(app)
        .get('/api/usuarios/perfil');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('GET /api/usuarios/perfil con token válido debe pasar', async () => {
      const response = await request(app)
        .get('/api/usuarios/perfil')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Control de Acceso por Rol', () => {
    test('GET /api/usuarios/admin con usuario normal (agent) debe fallar', async () => {
      const response = await request(app)
        .get('/api/usuarios/admin')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(403);
    });

    test('GET /api/usuarios/admin con admin debe pasar', async () => {
      const response = await request(app)
        .get('/api/usuarios/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Reglas de Negocio por Rol', () => {
    // Pruebas para gestión de usuarios (secretario)
    test('Secretario debe poder acceder a las rutas de usuarios', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${secretaryToken}`);
      expect(response.statusCode).toBe(200);
    });

    test('Agente NO debe poder acceder a las rutas de usuarios', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${testToken}`);
      expect(response.statusCode).toBe(403);
    });

    // Pruebas para gestión de propiedades (agente)
    test('Agente debe poder acceder a las rutas de propiedades', async () => {
      const response = await request(app)
        .get('/api/propiedades')
        .set('Authorization', `Bearer ${testToken}`);
      expect(response.statusCode).toBe(200);
    });

    test('Secretario NO debe poder acceder a las rutas de propiedades', async () => {
      const response = await request(app)
        .get('/api/propiedades')
        .set('Authorization', `Bearer ${secretaryToken}`);
      expect(response.statusCode).toBe(403);
    });
  });
});