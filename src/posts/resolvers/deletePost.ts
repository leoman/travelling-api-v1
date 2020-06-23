import { ApolloError, UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Post } from '../'
import { Context, SelectPostArgs } from '../../types'

export default async (_parent: any, args: SelectPostArgs, { decodedToken }: Context) => {

  if (!decodedToken) {
    throw new UserInputError('Not Authenticated, please sign in')
  }

  const post = await Post.findOne({ where: { id: args.id } })

  if (!post) { 
    throw new UserInputError(`No Post found with ID: ${args.id}`, {
      invalidArgs: args,
    })
  }

  try {
    await post.destroy()
    logger.log('info', `Deleting a Post with ID: ${args.id}`)
    return { success: true, message: 'Deleted' }
  } catch(error) {
    throw new ApolloError(`Unable to delete Post with ID: ${args.id}`, '500', {
      error
    })
  }
}