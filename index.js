require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const { MongoClient } = require('mongodb');

const Images = require('./src/datasourses/images');
const { schema } = require('./src/schema');

let client;

client = new MongoClient(process.env.dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();

const apolloServer = new ApolloServer({
  schema,
  dataSources: () => ({
    images: new Images(client.db().collection('images')),
  }),
  context: async () => {
    // const {} = process.env;

    return {};
  },
  cors: {
    credentials: true,
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:3001',
        'http://localhost:4001',
        undefined, // added to gain access to graphql playground
      ];

      if (allowed.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
});

apolloServer
  .listen({
    port: 4001,
    path: '/api/graphql',
  })
  .then(({ url }) => {
    console.info(`Server running at ${url}api/graphql`);
  });
