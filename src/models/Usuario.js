const bcrypt = require('bcrypt');

class Usuario {
  constructor({ id, nombre, rol, email, password }) {
    this.id = id;
    this.nombre = nombre;
    this.rol = rol;
    this.email = email;
    this.password = password;
  }

  esAdmin() {
    return this.rol === 'Admin';
  }

  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = Usuario;