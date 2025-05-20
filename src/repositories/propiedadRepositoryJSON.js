const fs = require('fs');
const path = require('path');
const propiedadesPath = path.join(__dirname, '..', 'database', 'propiedades.json');

const inicializarArchivoPropiedades = () => {
  const dirPath = path.dirname(propiedadesPath);
  
  // Crear directorio si no existe
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Crear o verificar el archivo
  if (!fs.existsSync(propiedadesPath)) {
    fs.writeFileSync(propiedadesPath, '[]', 'utf8');
    console.log('Archivo propiedades.json creado con un array vacío');
    return [];
  }
  
  try {
    // tuve problemas para que lea el archivo, así que validamos que el contenido esté ok
    const contenido = fs.readFileSync(propiedadesPath, 'utf8');
    try {
      return JSON.parse(contenido);
    } catch (error) {
      console.error('El archivo propiedades.json contiene JSON inválido. Recreando el archivo...');
      fs.writeFileSync(propiedadesPath, '[]', 'utf8');
      return [];
    }
  } catch (error) {
    console.error('Error al leer propiedades.json:', error.message);
    fs.writeFileSync(propiedadesPath, '[]', 'utf8');
    return [];
  }
};

const leerPropiedades = () => {
  return inicializarArchivoPropiedades();
};

const guardarPropiedades = (propiedades) => {
  try {
    fs.writeFileSync(propiedadesPath, JSON.stringify(propiedades, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar propiedades:', error.message);
    throw new Error('No se pudo guardar las propiedades en el archivo');
  }
};

const PropiedadRepositoryJSON = {
  getAll() {
    return leerPropiedades();
  },

  getById(id) {
    return leerPropiedades().find(p => p.id === id);
  },

  getByPropietario(id_propietario) {
    return leerPropiedades().filter(p => p.id_propietario === id_propietario);
  },

  getByEstado(estado) {
    return leerPropiedades().filter(p => p.estado === estado);
  },

  save(propiedad) {
    const propiedades = leerPropiedades();
    propiedades.push(propiedad);
    guardarPropiedades(propiedades);
    return propiedad;
  },

  update(id, datos) {
    const propiedades = leerPropiedades();
    const index = propiedades.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    propiedades[index] = { ...propiedades[index], ...datos };
    guardarPropiedades(propiedades);
    return propiedades[index];
  },

  delete(id) {
    const propiedades = leerPropiedades();
    const index = propiedades.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    const eliminada = propiedades.splice(index, 1)[0];
    guardarPropiedades(propiedades);
    return eliminada;
  }
};

module.exports = PropiedadRepositoryJSON;