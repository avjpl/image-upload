const { ApolloServer } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const { imageDefs, imageResolvers } = require('../../src/typedefs/image');
const typeDefs = require('../../src/typedefs/typeDefs');

const createTestServer = ({ ctx, sources }) => {
  const server = new ApolloServer({
    typeDefs: [typeDefs, imageDefs],
    resolvers: imageResolvers,
    mockEntireSchema: false,
    mocks: true,
    dataSources: () => sources,
    context: () => ctx,
  });

  return createTestClient(server);
};

module.exports.createTestServer = createTestServer;
