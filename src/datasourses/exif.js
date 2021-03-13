const { RESTDataSource } = require('apollo-datasource-rest');

class Extif extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000';
  }

  async getExtif() {
    return await this.get('/exif');
  }
}

module.exports = Extif;
