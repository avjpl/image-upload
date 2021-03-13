const { makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const schemaDirectives = require('./directives');
const typeDefs = require('./typedefs/typeDefs');
const { exifDefs, exifResolvers } = require('./typedefs/exif');
const { uploadDefs, uploadResolvers } = require('./typedefs/upload');

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, exifDefs, uploadDefs],
  resolvers: [merge(exifResolvers, uploadResolvers)],
  schemaDirectives,
});

module.exports.schema = schema;
