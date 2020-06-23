export interface Context {
  decodedToken: string
}

export { Photo, Resolvers as PhotoResolvers, PostArgs as PhotoPostArgs, DeleteArgs } from './photo'

export { Location } from './location'

export { Post, Status, Resolvers as PostResolvers, PostArgs as PostPostArgs, PatchArgs as PostPatchArgs, AllPostsArgs, SelectPostArgs } from './post'