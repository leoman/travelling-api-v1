import { ApolloError } from 'apollo-server'
import logger from '../../logging'
import { Photo } from '../'
import { Photo as PhotoI } from '../../types'

export default async () => {
  try {
    logger.log('info', 'Finding all Photos')
    const photos: PhotoI[] = await Photo.findAll()
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