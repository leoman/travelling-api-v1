import { UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Photo } from '../'
import { Post } from '../../posts'
import { Context, PhotoPostArgs } from '../../types'

export default async (_parent: any, args: PhotoPostArgs, { decodedToken }: Context) => {
  try {

    if (!decodedToken) {
      throw new UserInputError('Not Authenticated, please sign in')
    }

    const post = await Post.findOne({ where: { id: args.id }, include: [
      { association: Post.associations.Photos }
    ] })

    if (!post) {
      throw new UserInputError(`No Post found with ID: ${args.id}`, {
        invalidArgs: args,
      })
    }

    const photo = await Photo
      .create({
        url: args.url,
      })

    await post.addPhoto(photo)

    logger.log('info', `Saving a new Photo to a post Post ${photo.url}`)
   
    return photo
  } catch(error) {
    console.log(error)
    logger.log({
      level: 'error',
      message:'Error saving a new Photo',
      errors: error.errors.map((error: { message: string }) => error.message)
    })

    throw new UserInputError(error.errors.map((error: { message: string }) => error.message), {
      invalidArgs: args,
    })
  }
}