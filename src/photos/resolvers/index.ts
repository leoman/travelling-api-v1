import allPhotos from './allPhotos'
import addPhoto from './addPhoto'
import deletePhoto from './deletePhoto'
import { PhotoResolvers } from '../../types'

export const resolvers: PhotoResolvers = {
  Query: {
    allPhotos
  },
  Mutation: {
    addPhoto,
    deletePhoto
  }
}