const { app } = require('../src/app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');

describe('Rutas Protegidas con JWT', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Conectarse a la base de datos de prueba en memoria
    await mongoose.connect(process.env.MONGO_URI);

    // Limpiar la colección antes de crear nuevos usuarios de prueba
    await Usuario.deleteMany({});
    
    // Crear usuario de prueba en la base de datos
    testUser = await Usuario.create({
      nombre: 'Test User',
      email: 'test@protected.com',
      password: 'Password123!'
    });

    // Generar token JWT válido
    authToken = jwt.sign(
      { id: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Desconectar de la base de datos después de las pruebas
    await mongoose.disconnect();
  });

  test('GET /api/protected/dashboard - Acceso con token válido', async () => {
    const response = await request(app)
      .get('/api/protected/dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/protected/dashboard - Acceso sin token', async () => {
    const response = await request(app)
      .get('/api/protected/dashboard');

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});