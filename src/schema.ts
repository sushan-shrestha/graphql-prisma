import { gql } from "apollo-server";

export const typeDefs = gql`
type User {
    id: ID!
    name: String!
    email: String!
    token: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    login(email:String!, password: String!):User
  }
`;