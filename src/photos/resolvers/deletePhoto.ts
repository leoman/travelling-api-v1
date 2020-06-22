import { ApolloError, UserInputError } from 'apollo-server'
import logger from '../../logging'
import { Photo } from '../'
import { Context, DeleteArgs } from '../../types'

export default async (_parent: any, args: DeleteArgs, { decodedToken }: Context) => {

  if (!decodedToken) {
    throw new UserInputError('Not Authenticated, please sign in')
  }

  const photo = await Photo.findOne({ where: { id: args.id } })

  if (!photo) { 
    throw new UserInputError(`No Photo found with ID: ${args.id}`, {
      invalidArgs: args,
    })
  }

  try {
    await photo.destroy()
    logger.log('info', `Deleting Photo with ID: ${args.id}`)
    return { success: true, message: 'Deleted' }
  } catch(error) {
    throw new ApolloError(`Unable to delete Photo with ID: ${args.id}`, '500', {
      error
    })
  }
}