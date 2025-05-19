const { readData, writeData } = require('../database/db');

class User {
  constructor({ id, name, email, password, role = 'agent' }) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date().toISOString();
  }

  static async findByEmail(email) {
    const users = await readData('users');
    const userData = users.find(u => u.email === email);
    return userData ? new User(userData) : null;
  }

  async save() {
    const users = await readData('users');
    const existingIndex = users.findIndex(u => u.id === this.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    
    await writeData('users', users);
    return this;
  }
}

module.exports = User;