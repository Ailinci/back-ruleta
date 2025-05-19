const { readData, writeData } = require('../database/db');

class UserService {
  async findAll() {
    return await readData('users');
  }

  async create(user) {
    const users = await this.findAll();
    users.push(user);
    await writeData('users', users);
    return user;
  }
}

module.exports = new UserService();