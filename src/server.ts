import { merge } from 'lodash'
import { ApolloServer, makeExecutableSchema } from 'apollo-server'

import logger from './logging'

import { postTypeDef, postResolver } from './posts'
import { locationTypeDef } from './locations'
import { photoTypeDef, photoResolver } from './photos'
import { authTypeDef, authResolver, authenticateToken } from './auth'

import { sequelizeCheck, sequelizeSync } from './database'
sequelizeCheck()
sequelizeSync(false)


const Query = `
  type Query {
    _empty: String,
  }
  type Mutation {
    _empty: String,
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [ Query, postTypeDef, locationTypeDef, photoTypeDef, authTypeDef ],
  resolvers: merge(postResolver, photoResolver, authResolver),
})

const server = new ApolloServer({ schema, context: async ({ req }) => authenticateToken(req) })

server.listen().then(({ url, subscriptionsUrl }): void => {
  logger.log('info', `🚀 Server ready at ${url}`)
  logger.log('info',`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})