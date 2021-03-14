const { createWriteStream, unlinkSync } = require('fs');
const path = require('path');
const { gql } = require('apollo-server');

const { GraphQLObject } = require('../types');
const exif = require('../utils/exif');

const storeFile = ({ filename, stream }) => {
  const uploadDir = process.env.uploadFolder;
  const filePath = path.resolve(uploadDir, filename);

  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated) unlinkSync(filePath);
        reject(error);
      })
      .pipe(createWriteStream(filePath))
      .on('error', (error) => reject(error))
      .on('finish', () =>
        resolve({
          sourceFile: `${uploadDir}/${filename}`,
        }),
      ),
  );
};

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Query {
    uploads: [File]
  }

  extend type Mutation {
    uploadFile(files: [Upload!]): File!
  }
`;

const resolvers = {
  Object: GraphQLObject,
  Mutation: {
    uploadFile: async (_, { files }, { dataSources: { images } }) => {
      const imagesWithExif = files.map(async (file) => {
        try {
          const { filename, createReadStream } = await file;
          const stream = createReadStream();
          const pathObj = await storeFile({ filename, stream });
          const exifData = await exif(pathObj.sourceFile);
          return { ...exifData, ...pathObj };
        } catch (e) {
          console.log(e);
        }
      });

      console.log(await Promise.all(imagesWithExif));
      await images.save(await Promise.all(imagesWithExif));

      return {
        filename: 'success',
      };
    },
  },
};

module.exports.uploadDefs = typeDefs;
module.exports.uploadResolvers = resolvers;
