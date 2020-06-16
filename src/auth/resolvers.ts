import { UserInputError, ApolloError } from 'apollo-server'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import logger from '../logging'
import config from '../config/user.json'

interface User {
  username: string
  password: string
}

interface AuthResponse {
  auth: boolean
  token: string
}

interface Resolvers {
  Mutation: {
    login: (parent: any, args: User) => Promise<AuthResponse>;
  }
}

const authenticateUserCredentials = (username: string, password: string) => {

  const { user } = config.auth
  
  let passwordIsValid = false

  if (username === "" || password === "") {
    throw new UserInputError(`User credentials were incorrect`)
  }

  try {
      passwordIsValid = bcrypt.compareSync(password, user.password)
  } catch (error) {
    throw new ApolloError(`An error occuered while parsing the users password`, '500', error)
  }

 

  if (username !== user.username || !passwordIsValid) {
    throw new UserInputError(`User credentials were incorrect`, {
      invalidArgs: [username, password],
    })
  }

  return user.username
}

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_root, args) => {
      try {

        const username = authenticateUserCredentials(args.username, args.password)
  
        const token = jwt.sign({ username: username }, config.auth.secret, {
            expiresIn: 86400
        });

        return { auth: true, token: token }
      } catch(error) {
        logger.log({
          level: 'error',
          message:'Error logging in',
        })
        throw error
      }
    }
  }
};