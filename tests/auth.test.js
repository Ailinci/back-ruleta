const { server } = require('../src/app'); // Importa server en lugar de app
const request = require('supertest');
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const jwt = require('jsonwebtoken');

describe('Auth Middleware Tests', () => {
  let testToken;
  let adminToken;

  beforeAll(async () => {
    // Crear usuario de prueba
    const user = await Usuario.create({
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      rol: 'usuario'
    });

    // Crear admin de prueba
    const admin = await Usuario.create({
      nombre: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      rol: 'admin'
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
  });

  afterAll(async () => {
    await Usuario.deleteMany({});
    await mongoose.disconnect();
  });

  describe('Rutas protegidas', () => {
    test('GET /api/usuarios/perfil sin token debe fallar', async () => {
      const response = await request(server) // Usa server aquí
        .get('/api/usuarios/perfil');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('GET /api/usuarios/perfil con token válido debe pasar', async () => {
      const response = await request(server) // Usa server aquí
        .get('/api/usuarios/perfil')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Control de roles', () => {
    test('GET /api/usuarios/admin con usuario normal debe fallar', async () => {
      const response = await request(server) // Usa server aquí
        .get('/api/usuarios/admin')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(403);
    });

    test('GET /api/usuarios/admin con admin debe pasar', async () => {
      const response = await request(server) // Usa server aquí
        .get('/api/usuarios/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });
  });
});