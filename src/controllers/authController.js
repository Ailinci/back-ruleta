const UsuarioRepo = require('../repositories/usuarioRepositoryMONGO');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (email, password) => {
  const usuario = await UsuarioRepo.getByEmail(email);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const passwordValido = await usuario.compararPassword(password);
  if (!passwordValido) {
    throw new Error('Contraseña incorrecta');
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

const registerUser = async (userData) => {
  const { email, rol } = userData;

  // Asegurar un rol por defecto si no se proporciona
  if (!rol) {
    userData.rol = 'usuario';
  }

  const emailExistente = await UsuarioRepo.existsByEmail(email);
  if (emailExistente) {
    throw new Error('El email ya está registrado');
  }

  const nuevoUsuario = await UsuarioRepo.save(userData);
  return nuevoUsuario;
};

module.exports = {
  loginUser,
  registerUser
};
