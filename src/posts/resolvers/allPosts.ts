import { ApolloError } from 'apollo-server'
import logger from '../../logging'
import { Post, validStatuses } from '../'
import { Photo } from '../../photos'
import { Location } from '../../locations'
import { AllPostsArgs } from '../../types'

export default async (_parent: any, args: AllPostsArgs) => {
  try {
    logger.log('info', 'Finding all Posts')

    const status = args.status;

    let where = {};

    if(status && validStatuses.includes(status)) {
        where = { status };
    }

    const posts = await Post.findAll({
      where: where,
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

    return posts.map((post: any) => ({
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