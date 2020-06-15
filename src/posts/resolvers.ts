import { UserInputError, ApolloError } from 'apollo-server'
import logger from '../logging'
import { Post } from './'
import { Location } from '../locations'
import { Photo } from '../photos'

interface PostArgs {
  title: string
  titleColour?: string
  content?: string
  date?: Date
  order?: Date
  photo?: string
  status?: string
  lat?: number
  lng?: number
  location?: string
  duration?: number
  hideFromBounding?: boolean
}

interface PatchArgs extends PostArgs {
  [key: string]: any
  id: string
}

interface DeleteArgs {
  id: string
}

interface Resolvers {
  Query: {
    [field: string]: (parent: any, args: object) => Promise<Post[]>;
  }
  Mutation: {
    addPost: (parent: any, args: PostArgs) => Promise<Post>;
    editPost: (parent: any, args: PatchArgs) => Promise<Post>;
    deletePost: (parent: any, args: DeleteArgs) => Promise<{ success: boolean, message: string }>;
  }
}

const patchPostKeys: string[] = [
  'title',
  'titleColour',
  'content',
  'date',
  'order',
  'photo',
  'status',
]

const patchLocationKeys: string[] = [
  'lat',
  'lng',
  'location',
  'duration',
  'hideFromBounding'
]

export const resolvers: Resolvers = {
  Query: {
    allPosts: async () => {
      try {
        logger.log('info', 'Finding all Posts')
        const posts: Post[] = await Post.findAll({
          order: [
              ['order', 'DESC'],
          ],
          include: [
              {
                  model: Location,
              },
              {
                  model: Photo,
              }
          ]
        })

        return posts.map(post => ({
          ...post.dataValues,
          location: post.Location,
          photos: post.Photos
        }))
      } catch(error) {
        logger.log({
          level: 'error',
          message:'Unable to fetch all Posts',
          extra: error.message
        })
        throw new ApolloError(`Unable to fetch Posts`, '500', {
          error
        })
      }
    }
  },
  Mutation: {
    addPost: async (_root, args) => {
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
    },
    editPost: async (_parent, args) => {

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
    },
    deletePost: async (_root, args) => {
      const post = await Post.findOne({ where: { id: args.id } })

      if (!post) { 
        throw new UserInputError(`No Post found with ID: ${args.id}`, {
          invalidArgs: args,
        })
      }

      try {
        await post.destroy()
        return { success: true, message: 'Deleted' }
      } catch(error) {
        throw new ApolloError(`Unable to delete Post with ID: ${args.id}`, '500', {
          error
        })
      }
    }
  }
};