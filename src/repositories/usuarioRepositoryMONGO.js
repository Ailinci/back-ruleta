// src/repositories/usuarioRepositoryMONGO.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let usuariosCollection;

async function connect() {
  if (!usuariosCollection) {
    try {
      await client.connect();
      const db = client.db('alquilarte');
      usuariosCollection = db.collection('usuarios');
      console.log('✅ Conexión a MongoDB establecida');
    } catch (err) {
      console.error('❌ Error al conectar a MongoDB:', err);
      throw err;
    }
  }
}

module.exports = {
  async getByEmail(email) {
    try {
      await connect();
      const user = await usuariosCollection.findOne({ email });
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
      await connect();
      const result = await usuariosCollection.insertOne(userData);
      console.log('✔️ Usuario creado con ID:', result.insertedId);
      return { ...userData, _id: result.insertedId };
    } catch (err) {
      console.error('❌ Error guardando usuario:', err);
      throw err;
    }
  },

  async existsByEmail(email) {
    try {
      await connect();
      const exists = await usuariosCollection.countDocuments({ email }) > 0;
      console.log('🔍 Email existe:', exists, 'para', email);
      return exists;
    } catch (err) {
      console.error('❌ Error verificando email:', err);
      throw err;
    }
  },

  async updateUser(id, updateData) {
    try {
      await connect();
      const result = await usuariosCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      console.log('🔄 Usuario actualizado:', result.modifiedCount, 'registros');
      return result.modifiedCount > 0;
    } catch (err) {
      console.error('❌ Error actualizando usuario:', err);
      throw err;
    }
  },

  async closeConnection() {
    try {
      if (client) {
        await client.close();
        usuariosCollection = null;
        console.log('🔌 Conexión a MongoDB cerrada');
      }
    } catch (err) {
      console.error('❌ Error cerrando conexión:', err);
    }
  }
};