const { MongoDataSource } = require('apollo-datasource-mongodb');

class Images extends MongoDataSource {
  async getImages() {
    try {
      const cursor = this.collection.find();

      if ((await cursor.count()) === 0) {
        return [];
      }

      return cursor.toArray();
    } catch (e) {
      console.error(e);
    }
  }

  async save(images) {
    try {
      return await this.collection.insertMany(images);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Images;
