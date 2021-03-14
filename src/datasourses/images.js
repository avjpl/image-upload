const { MongoDataSource } = require('apollo-datasource-mongodb');

class Images extends MongoDataSource {
  getAllImages() {
    return this.find();
  }

  async save(imags) {
    return await this.collection.insertMany(imags);
  }
}

module.exports = Images;
