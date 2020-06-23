import { graphQLRequest, getJWToken, asyncForEach } from '../utils'
import sequelize from '../../database'
import { Photo } from '../../photos'
import { Post } from '../../posts'
import { Photo as PhotoI, Post as PostI } from '../../types'

interface SelectPhoto {
  id: number
}

interface NewPhoto extends SelectPhoto {
  url: string
}

const post: PostI = {
  title: 'My first post'
}

const photos: PhotoI[] = [
  {
    url: 'https://live.staticflickr.com/65535/48538852697_c147669d3c_b.jpg',
  },
  {
    url: 'https://live.staticflickr.com/65535/48572566706_11d7a68779_b.jpg',
  }
]

const allPhotos = () => {
  return graphQLRequest({
    query: `
      query {
        allPhotos {
          url
        }
      }
    `
  })
}

const addPhotos = ({ id, url }: NewPhoto, bearer: string, returnValues = `{
  id
  url
}`) => {
  return graphQLRequest({
    query: `
      mutation {
        addPhoto(
          id: "${id}",
          url: "${url}",
        ) ${returnValues}
      }
    `,
    bearer: `bearer ${bearer}`
  })
}

const deletePhoto = ({ id }: SelectPhoto, bearer: string, returnValues = `{
  success
}`) => {
  return graphQLRequest({
    query: `
      mutation {
        deletePhoto(
          id: "${id}",
        ) ${returnValues}
      }
    `,
    bearer: `bearer ${bearer}`
  })
}

beforeEach(async (done) => {
  await Photo.destroy({where: {}})
  await Post.destroy({where: {}})

  await asyncForEach(photos, async (photo: PhotoI) => {
    
    try {
      return await Photo
      .create({
        url: photo.url,
      })
    } catch(error) {
      console.log(error)
    }
  })
  done()
})

afterAll(async (done) => {
  await Photo.destroy({where: {}})
  await Post.destroy({where: {}})
  sequelize.close() 
  done()
})

describe('photos', () => {
  describe('allPhotos', () => {
    it('should return all the photos', () => {
      return allPhotos()
        .expect(res => {
          expect(res.body).toHaveProperty('data.allPhotos')
          expect(res.body.data.allPhotos).toEqual(photos)
        })
        .expect(200)
    })

    it('should add a new photo', async () => {

      const newPost = await Post.create(post)

      const bearer = await getJWToken()

      const newPhoto = { id: newPost.id, url: 'https://live.staticflickr.com/65535/48572714307_32c1605b43_b.jpg'}

      return addPhotos(newPhoto, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('data.addPhoto')
          expect(res.body.data.addPhoto.url).toEqual(newPhoto.url)
        })
        .expect(200)
    })

    it('should delete a photo', async () => {

      const newPost = await Post.create(post)

      const bearer = await getJWToken()

      const newPhoto = { id: newPost.id, url: 'https://live.staticflickr.com/65535/48572714307_32c1605b43_b.jpg'}

      const returnedNewPhoto = await addPhotos(newPhoto, bearer)

      const newPhotoId = returnedNewPhoto.body.data.addPhoto.id

      await allPhotos()
        .expect(res => {
          expect(res.body).toHaveProperty('data.allPhotos')
          expect(res.body.data.allPhotos.length).toEqual(3)
        })
        .expect(200)

      await deletePhoto({ id: newPhotoId }, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('data.deletePhoto')
          expect(res.body.data.deletePhoto.success).toEqual(true)
        })
        .expect(200)

      return allPhotos()
        .expect(res => {
          expect(res.body).toHaveProperty('data.allPhotos')
          expect(res.body.data.allPhotos.length).toEqual(2)
        })
        .expect(200)
      
    })
  })
})