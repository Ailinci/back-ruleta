class Usuario {
  constructor({ id, nombre, rol, email }) {
    this.id = id;
    this.nombre = nombre;
    this.rol = rol;
    this.email = email;
  }

  esAdmin() {
    return this.rol === 'Admin';
  }
}

module.exports = Usuario;
