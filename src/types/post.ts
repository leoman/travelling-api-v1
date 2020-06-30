
import { Location } from './location'
import { Context } from './'

export enum Status {
  live = "live",
  draft = "draft"
}

export interface Post {
  id?: number
  title: string
  slug?: string
  titleColour?: string
  content?: string
  date?: Date | string
  order?: Date | string
  photo?: string
  status?: Status
  location?: Location
}

export interface AllPostsArgs {
  status: Status | null
}

export interface PostArgs {
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

export interface PatchArgs extends PostArgs {
  [key: string]: any
  id: string
}

export interface SelectPostArgs {
  id?: string
  slug?: string
}

interface DeleteSuccess {
  success: boolean
  message: string
}

export interface Resolvers {
  Query: {
    allPosts: (parent: any, args: AllPostsArgs) => Promise<Post[]>;
    post: (parent: any, args: SelectPostArgs) => Promise<Post>;
  }
  Mutation: {
    addPost: (parent: any, args: PostArgs, context: Context) => Promise<Post>;
    editPost: (parent: any, args: PatchArgs, context: Context) => Promise<Post>;
    deletePost: (parent: any, args: SelectPostArgs, context: Context) => Promise<DeleteSuccess>;
  }
}