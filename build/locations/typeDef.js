"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDef = void 0;
exports.typeDef = `
  type Location {
    id: ID!
    location: String!
    lat: Float!
    lng: Float!
    duration: Int!
    hideFromBounding: Boolean!
  }
`;
