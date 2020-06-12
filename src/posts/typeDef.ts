export const typeDef = `
  
  extend type Query {
    allPosts: [Post!]!
  }

  extend type Mutation {
    addPost (
      title: String!
      titleColour: String
      content: String
      date: String
      order: String
      photo: String
      status: Status
    ): Post
    editPost (
      id: String!
      title: String
      titleColour: String
      content: String
      date: String
      order: String
      photo: String
      status: Status
    ) : Post
    deletePost (
      id: String!
    ): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

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