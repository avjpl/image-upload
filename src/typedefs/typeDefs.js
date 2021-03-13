const { gql } = require('apollo-server');

const typeDefs = gql`
  directive @date(defaultFormat: String = "Do MMMM YYYY") on FIELD_DEFINITION

  scalar Date
  scalar Object
  scalar Upload

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

module.exports = typeDefs;
