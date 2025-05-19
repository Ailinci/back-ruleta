const fs = require('fs').promises;
const path = require('path');

class JSONDatabase {
  constructor(collection) {
    this.filePath = path.join(__dirname, '../database', `${collection}.json`);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.filePath, '[]');
        return [];
      }
      throw error;
    }
  }

  async writeData(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = {
  readData: async (collection) => {
    const db = new JSONDatabase(collection);
    return await db.readData();
  },
  writeData: async (collection, data) => {
    const db = new JSONDatabase(collection);
    await db.writeData(data);
  }
};