import { ApolloError, UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Post } from '../'
import { SelectPostArgs } from '../../types'

export default async (_parent: any, args: SelectPostArgs) => {
  try {
    
    const { id, slug }: SelectPostArgs = args

    if (!id && !slug) {
      throw new UserInputError(`No ID or Slug was provided`, {
        invalidArgs: args,
      })
    }

    const where = (id) ? { id } : { slug }

    logger.log('info', `Finding a single Post: ${JSON.stringify(where)}`)

    const post = await Post.findOne({ where: where, include: [
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
      // @ts-ignore
      location: post.Location,
      // @ts-ignore
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