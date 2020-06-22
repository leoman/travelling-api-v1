import { Context } from './'

export interface Photo {
  id?: number
  url: string
}

export interface PostArgs {
  id: string
  url: string
}

export interface DeleteArgs {
  id: string
}

interface DeleteSuccess {
  success: boolean
  message: string
}

export interface Resolvers {
  Query: {
    allPhotos: (parent: any, args: object) => Promise<Photo[]>;
  }
  Mutation: {
    addPhoto: (parent: any, args: PostArgs, context: Context) => Promise<Photo>;
    deletePhoto: (parent: any, args: DeleteArgs, context: Context) => Promise<DeleteSuccess>;
  }
}