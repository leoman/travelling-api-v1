export const typeDef = `
  
  enum Status {
    live
    draft
  }

  type Post {
    id: ID!
    title: String!
    slug: String!
    titleColour: String!
    content: String!
    date: String!
    order: String!
    photo: String!
    status: Status!
    location: Location!
    photos: [Photo!]!
  }
`