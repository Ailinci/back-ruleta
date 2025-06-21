const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let propiedadesCollection;

async function connect() {
  if (!propiedadesCollection) {
    await client.connect();
    const db = client.db('alquilarte');
    propiedadesCollection = db.collection('propiedades');
  }
}

const PropiedadRepositoryMONGO = {
  async getAll() {
    await connect();
    return await propiedadesCollection.find().toArray();
  },

  async getById(id) {
    await connect();
    try {
      return await propiedadesCollection.findOne({ _id: new ObjectId(id) });
    } catch {
      return null;
    }
  },

  async getByPropietario(id_propietario) {
    await connect();
    return await propiedadesCollection.find({ id_propietario }).toArray();
  },

  async getByEstado(estado) {
    await connect();
    return await propiedadesCollection.find({ estado }).toArray();
  },

  async save(propiedad) {
    await connect();
    const result = await propiedadesCollection.insertOne(propiedad);
    return { ...propiedad, _id: result.insertedId };
  },

  async update(id, datos) {
    await connect();
    try {
      const result = await propiedadesCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: datos },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch {
      return null;
    }
  },

  async delete(id) {
    await connect();
    try {
      const result = await propiedadesCollection.findOneAndDelete({ _id: new ObjectId(id) });
      return result.value;
    } catch {
      return null;
    }
  }
};

module.exports = PropiedadRepositoryMONGO;
