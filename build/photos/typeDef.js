"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDef = void 0;
exports.typeDef = `
  type Photo {
    id: ID!
    url: String!
  }

  type PhotoDeleteResponse {
    success: Boolean!
    message: String!
    id: String!
  }

  extend type Query {
    allPhotos: [Photo!]!
  }

  extend type Mutation {
    addPhoto (
      id: String!
      url: String!
    ): Photo
    deletePhoto (
      id: String!
    ): PhotoDeleteResponse
  }
`;
