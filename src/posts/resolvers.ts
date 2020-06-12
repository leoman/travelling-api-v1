import { UserInputError, ApolloError } from 'apollo-server'
import logger from '../logging'
import { Post } from './'

interface PostArgs {
  title: string
  titleColour?: string
  content?: string
  date?: Date
  order?: Date
  photo?: string
  status?: string
}

const postKeys: string[] = [
  'title',
  'titleColour',
  'content',
  'date',
  'order',
  'photo',
  'status'
]

interface PatchArgs extends PostArgs {
  [key: string]: any
  id: string
}

interface DeleteArgs {
  id: string
}

interface Resolvers {
  Query: {
    [field: string]: (parent: any, args: object) => Promise<Post[] | undefined>;
  }
  Mutation: {
    addPost: (parent: any, args: PostArgs) => Promise<Post>;
    editPost: (parent: any, args: PatchArgs) => Promise<Post>;
    deletePost: (parent: any, args: DeleteArgs) => Promise<{ success: boolean, message: string }>;
  }
}

export const resolvers: Resolvers = {
  Query: {
    allPosts: async (): Promise<Post[] | undefined> => {
      try {
        logger.log('info', 'Finding all Posts')
        const posts: Post[] = await Post.findAll({
          order: [
              ['order', 'DESC'],
          ]
        })
        return posts
      } catch(e) {
        logger.log({
          level: 'error',
          message:'Unable to fetch all Posts',
          extra: e.message
        })
      }
    }
  },
  Mutation: {
    addPost: async (_root, args) => {
      try {
        const post = await Post
          .create({
              title: args.title,
              titleColour: args.titleColour,
              content: args.content,
              date: args.date || new Date(),
              photo: args.photo,
              status: args.status,
              order: args.order,
          })
        logger.log('info', `Saving a new Post ${post.title}`)
        return post;
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
        const post = await Post.findOne({ where: { id: args.id } })
        
        if (!post) {
          throw new UserInputError(`No Post found with ID: ${args.id}`, {
            invalidArgs: args,
          })
        }


        const fieldsToUpdate = postKeys.reduce((agg: { [key: string]: any }, key) => {
          if (args[key]) {
            agg[key] = args[key]
          }
          return agg
        }, {})

        const updatedPost = await post.update(fieldsToUpdate)

        return updatedPost

      } catch(error) {
        console.log(error)
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