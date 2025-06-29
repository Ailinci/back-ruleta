// src/repositories/usuarioRepositoryMONGO.js
const Usuario = require('../models/Usuario');

module.exports = {
  async getAll() {
    return Usuario.find();
  },

  async getById(id) {
    return Usuario.findById(id);
  },

  async getByEmail(email) {
    try {
      // Usamos .select('+password') para que la contraseña venga en la consulta,
      // ya que por defecto el esquema la omite.
      const user = await Usuario.findOne({ email }).select('+password');
      if (!user) {
        console.log('⚠️ Usuario no encontrado para email:', email);
      }
      return user;
    } catch (err) {
      console.error('❌ Error buscando usuario:', err);
      throw err;
    }
  },

  async save(userData) {
    try {
      const newUser = new Usuario(userData);
      // El pre-save hook de Mongoose hasheará la contraseña aquí
      const savedUser = await newUser.save();
      console.log('✔️ Usuario creado con ID:', savedUser._id);
      return savedUser;
    } catch (err) {
      console.error('❌ Error guardando usuario:', err);
      throw err;
    }
  },

  async existsByEmail(email) {
    try {
      const exists = await Usuario.exists({ email });
      console.log('🔍 Email existe:', !!exists, 'para', email);
      return !!exists;
    } catch (err) {
      console.error('❌ Error verificando email:', err);
      throw err;
    }
  },

  async updateUser(id, updateData) {
    try {
      // { new: true } devuelve el documento actualizado
      const updatedUser = await Usuario.findByIdAndUpdate(id, updateData, { new: true });
      console.log('🔄 Usuario actualizado:', updatedUser ? '1 registro' : '0 registros');
      return updatedUser;
    } catch (err) {
      console.error('❌ Error actualizando usuario:', err);
      throw err;
    }
  },

  async delete(id) {
    return Usuario.findByIdAndDelete(id);
  },

  // La conexión y cierre de conexión ahora son manejados por Mongoose centralmente,
  // por lo que no necesitamos los métodos connect() y closeConnection() aquí.
};