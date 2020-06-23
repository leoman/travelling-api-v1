import { ApolloError, UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Post } from '../'
import { patchPostKeys, patchLocationKeys } from './'
import { Context, PostPatchArgs } from '../../types'

export default async (_parent: any, args: PostPatchArgs, { decodedToken }: Context) => {

  if (!decodedToken) {
    throw new UserInputError('Not Authenticated, please sign in')
  }

  try {
    const post = await Post.findOne({ where: { id: args.id }, include: [
      { association: Post.associations.Location, }
    ] })
    
    if (!post) {
      throw new UserInputError(`No Post found with ID: ${args.id}`, {
        invalidArgs: args,
      })
    }

    const postFieldsToUpdate = patchPostKeys.reduce((agg: { [key: string]: any }, key) => {
      if (args[key] || args.hasOwnProperty(key)) {
        agg[key] = args[key]
      }
      return agg
    }, {})

    const locationFieldsToUpdate = patchLocationKeys.reduce((agg: { [key: string]: any }, key) => {
      if (args[key] || args.hasOwnProperty(key)) {
        agg[key] = args[key]
      }
      return agg
    }, {})

    const updatedPost = await post.update(postFieldsToUpdate)

    const updatedLocation = await updatedPost.Location.update(locationFieldsToUpdate)

    logger.log('info', `Editing a Post with ID: ${args.id}`)

    return {
      ...updatedPost.dataValues,
      location: {
        ...updatedLocation.dataValues
      }
    }
  } catch(error) {
    throw new ApolloError(`Unable to update Post with ID: ${args.id}`, '500', {
      error
    })
  }
}