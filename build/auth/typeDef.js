"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDef = void 0;
exports.typeDef = `
  type User {
    username: String!
    password: String!
  }

  type Auth {
    auth: Boolean!
    token: String!
  }

  extend type Mutation {
    login (
      username: String!
      password: String!
    ): Auth
  }
`;
