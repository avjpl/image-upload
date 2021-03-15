const { makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const schemaDirectives = require('./directives');
const typeDefs = require('./typedefs/typeDefs');
const { imageDefs, imageResolvers } = require('./typedefs/image');
const { uploadDefs, uploadResolvers } = require('./typedefs/upload');

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, imageDefs, uploadDefs],
  resolvers: [merge(imageResolvers, uploadResolvers)],
  schemaDirectives,
});

module.exports.schema = schema;
