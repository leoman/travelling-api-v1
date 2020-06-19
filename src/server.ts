import { merge } from 'lodash'
import express from 'express'
import { makeExecutableSchema } from 'apollo-server'
import { ApolloServer } from 'apollo-server-express'

import { postTypeDef, postResolver } from './posts'
import { locationTypeDef } from './locations'
import { photoTypeDef, photoResolver } from './photos'
import { authTypeDef, authResolver, authenticateToken } from './auth'

import { sequelizeCheck, sequelizeSync } from './database/database'
sequelizeCheck()
// sequelizeSync(false)


export const Query = `
  type Query {
    _empty: String,
    hello: String

  }
  type Mutation {
    _empty: String,
  }
`;

const resolvers = {	
  Query: {	
    hello: () => 'Hello world!',	
  },	
}

const schema = makeExecutableSchema({
  typeDefs: [ Query, postTypeDef, locationTypeDef, photoTypeDef, authTypeDef ],
  resolvers: merge(resolvers, postResolver, photoResolver, authResolver),
})

export const server = new ApolloServer({ schema, context: async ({ req }) => authenticateToken(req) })

const app = express();

server.applyMiddleware({ app });

export default app