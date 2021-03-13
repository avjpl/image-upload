const { gql } = require('apollo-server');

const IMAGE_QUERY = gql`
  query recipes {
    recipes: posts {
      id
      title
      slug
      image {
        file {
          url
          details {
            image
          }
        }
      }
    }
  }
`;

module.exports.IMAGE_QUERY = IMAGE_QUERY;
