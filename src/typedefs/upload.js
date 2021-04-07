const { createWriteStream, unlinkSync } = require('fs');
const { unlink } = require('fs').promises;
const { gql } = require('apollo-server');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

const { GraphQLObject } = require('../types');
const exif = require('../utils/exif');

const uploadDir = process.env.uploadFolder;

const storeFile = ({ filename, stream }) => {
  const filePath = path.resolve(uploadDir, filename);

  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated) unlinkSync(filePath);
        reject(error);
      })
      .pipe(createWriteStream(filePath))
      .on('error', (error) => reject(error))
      .on('finish', () => {
        resolve({
          sourceFile: `${uploadDir}/${filename}`,
        });
      }),
  );
};

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

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
      const imagesWithExif = (await Promise.all(files)).map(async (file) => {
        try {
          const { filename, createReadStream } = file;
          const stream = createReadStream();
          const pathObj = await storeFile({ filename, stream });
          const exifData = await exif(pathObj.sourceFile);
          await unlink(`${uploadDir}/${filename}`);

          return { ...exifData, ...pathObj, dateAdded: Date.now() };
        } catch (e) {
          console.error(e);
        }
      });

      (await Promise.all(files)).forEach(async (file) => {
        const form = new FormData();
        const { filename, mimetype, encoding, createReadStream } = file;
        const stream = createReadStream();

        await delay(100);

        form.append('filename', filename);
        form.append('mimetype', mimetype);
        form.append('encoding', encoding);
        form.append('image', stream);
        const formHeaders = form.getHeaders();

        try {
          await axios.post(process.env.imageEndpoint, form, {
            headers: {
              ...formHeaders,
            },
          });
        } catch (e) {
          console.error(e);
        }
      });

      await images.save(await Promise.all(imagesWithExif));

      return {
        filename: 'success',
      };
    },
  },
};

module.exports.uploadDefs = typeDefs;
module.exports.uploadResolvers = resolvers;
