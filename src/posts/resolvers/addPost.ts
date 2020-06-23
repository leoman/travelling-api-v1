import { UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Post } from '../'
import { Location } from '../../locations'
import { Context, PostPostArgs } from '../../types'

export default async (_parent: any, args: PostPostArgs, { decodedToken }: Context ) => {

  if (!decodedToken) {
    throw new UserInputError('Not Authenticated, please sign in')
  }

  try {

    const location = await Location
      .create({
        lat: args.lat,
        lng: args.lng,
        location: args.location,
        duration: args.duration,
        hideFromBounding: args.hideFromBounding,
      })

    const post = await Post
      .create({
          title: args.title,
          titleColour: args.titleColour,
          content: args.content,
          date: args.date || new Date(),
          photo: args.photo,
          status: args.status,
          order: args.order,
      }
    )

    await post.setLocation(location)

    logger.log('info', `Saving a new Post ${post.title}`)
   
    return {
      ...post.dataValues,
      location: {
        ...location.dataValues
      }
    }
  } catch(error) {
    logger.log({
      level: 'error',
      message:'Error saving a new Post',
      errors: error.errors.map((error: { message: string }) => error.message)
    })

    throw new UserInputError(error.errors.map((error: { message: string }) => error.message), {
      invalidArgs: args,
    })
  }
}