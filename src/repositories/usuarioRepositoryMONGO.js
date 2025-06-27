const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let usuariosCollection;

async function connect() {
  if (!usuariosCollection) {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('alquilarte');
    usuariosCollection = db.collection('usuarios');
    console.log('✅ Connected. Collection ready.');
  }
}

const UsuarioRepositoryMONGO = {
  async getAll() {
    try {
      await connect();
      const result = await usuariosCollection.find().toArray();
      console.log('📦 Found usuarios:', result.length);
      return result;
    } catch (err) {
      console.error('❌ Error in getAll:', err);
      throw err;
    }
  },

  async getById(id) {
    await connect();
    try {
      const usuario = await usuariosCollection.findOne({ id: id });
      return usuario;
    } catch (error) {
      console.error('Error buscando usuario por ID:', error);
      return null;
    }
  },

  async getByEmail(email) {
    await connect();
    return usuariosCollection.findOne({ email });
  },

  async existsByEmail(email) {
    await connect();
    const count = await usuariosCollection.countDocuments({ email });
    return count > 0;
  },

  async save(usuario) {
    await connect();
    const result = await usuariosCollection.insertOne(usuario);
    return { ...usuario, _id: result.insertedId };
  },

  async update(id, datos) {
    await connect();
    const result = await usuariosCollection.findOneAndUpdate(
      { id: id },
      { $set: datos },
      { returnDocument: 'after' }
    );
    return result.value;
  },

  async delete(id) {
    await connect();
    const result = await usuariosCollection.findOneAndDelete({ id: id });
    return result.value;
  },
};

module.exports = UsuarioRepositoryMONGO;