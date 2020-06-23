import allPosts from './allPosts'
import post from './post'
import addPost from './addPost'
import editPost from './editPost'
import deletePost from './deletePost'
import { PostResolvers } from '../../types'

export const patchPostKeys: string[] = [
  'title',
  'titleColour',
  'content',
  'date',
  'order',
  'photo',
  'status',
]

export const patchLocationKeys: string[] = [
  'lat',
  'lng',
  'location',
  'duration',
  'hideFromBounding'
]


export const resolvers: PostResolvers = {
  Query: {
    allPosts,
    post
  },
  Mutation: {
    addPost,
    editPost,
    deletePost
  }
}