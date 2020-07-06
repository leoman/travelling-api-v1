import app, { server } from './server'
import logger from './logging'

const port = process.env.PORT || 4000

try {
  app.listen({ port }, () =>
    logger.log('info', `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
} catch(error) {
  console.log(error)
}