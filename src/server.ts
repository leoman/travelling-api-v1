// import database from './database'
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server'
// import jwt from 'jsonwebtoken'
import { Post } from './posts'
import { Location } from './locations'
import { Photo } from './photos'

// const JWT_SECRET = 'MY_SUPER_SECRET_KEY'

export const Hello = `
  type Query {
    hello: String
  }
`


export const typeDefs = gql`
  type Query {
    hello: String
  }
`


const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  }
}

const schema = makeExecutableSchema({
  typeDefs: [ Post, Location, Photo, Hello ],
  resolvers
})

const server = new ApolloServer({ schema })

server.listen().then(({ url, subscriptionsUrl }): void => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})