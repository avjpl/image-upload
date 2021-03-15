const { gql } = require('apollo-server');

const typeDefs = gql`
  type Image {
    _id: ID!
    sourceFile: String!
    software: String
    model: String
    make: String
    lensModel: String
    lens: String
    aperture: String
    shutterSpeed: String
    exposureTime: String
    iso: Int
    imageWidth: Int
    imageHeight: Int
    mimeType: String
    focalLength: String
    megapixels: Float
    fileType: String
    compression: String
  }

  extend type Query {
    images: [Image!]!
  }
`;

const resolvers = {
  Query: {
    images: async (_, __, { dataSources: { images } }) => {
      try {
        return await images.getImages();
      } catch (e) {
        console.error(e);
      }
    },
  },
};

module.exports.imageDefs = typeDefs;
module.exports.imageResolvers = resolvers;
