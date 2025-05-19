const fs = require('fs');
const path = require('path');

const usuariosPath = path.join(__dirname, '..', 'usuarios.json');

class Usuario {
  constructor({ nombre, rol, email }) {
    this.id = Date.now().toString();
    this.nombre = nombre;
    this.rol = rol;
    this.email = email;
  }

  static leerTodos() {
    if (!fs.existsSync(usuariosPath)) fs.writeFileSync(usuariosPath, '[]');
    const data = fs.readFileSync(usuariosPath, 'utf-8');
    return JSON.parse(data);
  }

  static guardarTodos(usuarios) {
    if (!Array.isArray(usuarios)) {
      throw new Error('Intentando guardar algo que no es un array');
    }
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  }

  static buscarPorId(id) {
    const usuarios = this.leerTodos();
    return usuarios.find(u => u.id === id);
  }

  static actualizarPorId(id, datos) {
    const usuarios = this.leerTodos();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    if (datos.nombre) usuarios[index].nombre = datos.nombre;
    if (datos.rol) usuarios[index].rol = datos.rol;

    this.guardarTodos(usuarios);
    return usuarios[index];
  }

  static eliminarPorId(id) {
    const usuarios = this.leerTodos();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    const eliminado = usuarios.splice(index, 1)[0];
    this.guardarTodos(usuarios);
    return eliminado;
  }

  guardar() {
    const usuarios = Usuario.leerTodos();
    usuarios.push(this);
    Usuario.guardarTodos(usuarios);
    return this;
  }

  static actualizarPorId(id, datos) {
    const usuarios = this.leerTodos();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;
  
    if (datos.nombre) usuarios[index].nombre = datos.nombre;
    if (datos.rol) usuarios[index].rol = datos.rol;
    if (datos.email) usuarios[index].email = datos.email;
  
    this.guardarTodos(usuarios);
    return usuarios[index];
  }

  static buscarPorEmail(email) {
    const usuarios = this.leerTodos();
    return usuarios.find(u => u.email === email);
  }  

  static emailExiste(email) {
    const usuarios = this.leerTodos();
    return usuarios.some(u => u.email === email);
  }
}

module.exports = Usuario;
