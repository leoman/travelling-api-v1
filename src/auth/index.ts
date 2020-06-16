import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server'
import config from '../config/user.json'
export { typeDef as authTypeDef } from './typeDef'
export { resolvers as authResolver } from './resolvers'

export const authenticateToken = async (req: any) => {

  const auth = req ? req.headers.authorization : null

  if (auth && auth.toLowerCase().startsWith('bearer ')) {

    try {
      const decodedToken = jwt.verify(
        auth.substring(7), config.auth.secret
      )
      return { decodedToken }
    } catch (error) {
      throw new UserInputError('Failed to authenticate token.')
    }
  }

}