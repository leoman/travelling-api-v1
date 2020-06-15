export const typeDef = `
  type Photo {
    id: ID!
    url: String!
  }

  type PhotoDeleteResponse {
    success: Boolean!
    message: String!
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
`