import { ApolloError, UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Post } from '../'
import { SelectPostArgs } from '../../types'

export default async (_parent: any, args: SelectPostArgs) => {
  try {
    logger.log('info', `Finding a single Post: ${args.id}`)

    const post = await Post.findOne({ where: { id: args.id }, include: [
      { association: Post.associations.Location, },
      { association: Post.associations.Photos, }
    ] })

    if (!post) {
      throw new UserInputError(`No Post found with ID: ${args.id}`, {
        invalidArgs: args,
      })
    }

    return {
      ...post.dataValues,
      location: post.Location,
      photos: post.Photos
    }
  } catch(error) {
    logger.log({
      level: 'error',
      message:'Unable to fetch a single Post',
      extra: error.message
    })
    throw new ApolloError(`Unable to fetch Post`, '500', {
      error
    })
  }
}