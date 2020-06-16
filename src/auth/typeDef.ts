export const typeDef = `
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
`