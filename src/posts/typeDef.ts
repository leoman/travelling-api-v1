export const typeDef = `
  
  extend type Query {
    allPosts(status: String): [Post!]!
    post(id: String, slug: String): Post!
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
      location: String
      lat: Float
      lng: Float
      duration: Int
      hideFromBounding: Boolean
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
      location: String
      lat: Float
      lng: Float
      duration: Int
      hideFromBounding: Boolean
    ) : Post
    deletePost (
      id: String!
    ): PostDeleteResponse
  }

  type PostDeleteResponse {
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