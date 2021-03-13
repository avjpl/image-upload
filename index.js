require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const ExifAPI = require('./src/datasourses/exif');
const { schema } = require('./src/schema');

const apolloServer = new ApolloServer({
  schema,
  dataSources: () => ({
    exifAPI: new ExifAPI(),
  }),
  context: async () => {
    // const {} = process.env;

    return {};
  },
  cors: {
    credentials: true,
    origin: (origin, callback) => {
      const allowed = ['http://localhost:3001', 'http://localhost:4001'];

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
    console.log(`🚀  Server ready at ${url}`);
  });
