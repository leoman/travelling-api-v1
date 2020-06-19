import app from './server'
import logger from './logging'

try {
  app.listen({ port: 4000 }, () =>
    logger.log('info', `🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
} catch(error) {
  console.log(error)
}