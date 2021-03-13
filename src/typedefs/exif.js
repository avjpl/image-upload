const { gql } = require('apollo-server');

const { GraphQLObject } = require('../types');

const typeDefs = gql`
  type Exif {
    sourceFile: String
    imageSize: String
    software: String
    model: String
    make: String
    lensModel: String
    lensInfo: String
    lensFormat: String
    lensMount: String
    aperture: Float
    shutterSpeed: String
    exposureTime: String
    iso: Int
    focusMode: String
    imageWidth: Int
    imageHeight: Int
    afAreaMode: String
    afAreaModeSetting: String
    flexibleSpotPosition: String
    afTracking: String
    fileFormat: String
    focalLength: String
    megapixels: Float
    fileSize: String
    fileType: String
    compression: String
    electronicFrontCurtainShutter: String
    shutterCount: Int
  }

  extend type Query {
    exif: Exif
  }

  extend type Subscription {
    imageMeta: Exif
  }
`;

const resolvers = {
  Object: GraphQLObject,
  Query: {
    exif: async (_, __, { dataSources: { exifAPI } }) => {
      return await exifAPI.getExif();
    },
  },
};

module.exports.exifDefs = typeDefs;
module.exports.exifResolvers = resolvers;
