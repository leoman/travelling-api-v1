import { UserInputError, ApolloError } from 'apollo-server'
import logger from '../logging'
import { Photo } from './'
import { Post } from '../posts'

interface PostArgs {
  id: string
  url: string
}

interface DeleteArgs {
  id: string
}

interface Resolvers {
  Query: {
    [field: string]: (parent: any, args: object) => Promise<Photo[]>;
  }
  Mutation: {
    addPhoto: (parent: any, args: PostArgs) => Promise<Photo>;
    deletePhoto: (parent: any, args: DeleteArgs) => Promise<{ success: boolean, message: string }>;
  }
}

export const resolvers: Resolvers = {
  Query: {
    allPhotos: async () => {
      try {
        logger.log('info', 'Finding all Photos')
        const photos: Photo[] = await Photo.findAll()
        return photos
      } catch(error) {
        logger.log({
          level: 'error',
          message:'Unable to fetch all Photos',
          extra: error.message
        })
        throw new ApolloError(`Unable to fetch Photos`, '500', {
          error
        })
      }
    }
  },
  Mutation: {
    addPhoto: async (_root, args) => {
      try {

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

        await post.setPhotos(photo)

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
    },
    deletePhoto: async (_root, args) => {
      const photo = await Photo.findOne({ where: { id: args.id } })

      if (!photo) { 
        throw new UserInputError(`No Photo found with ID: ${args.id}`, {
          invalidArgs: args,
        })
      }

      try {
        await photo.destroy()
        return { success: true, message: 'Deleted' }
      } catch(error) {
        throw new ApolloError(`Unable to delete Photo with ID: ${args.id}`, '500', {
          error
        })
      }
    }
  }
};