import request from 'supertest';
import app from '../../server'
import sequelize from '../../database'
import { Photo, PhotoI } from '../../photos'
import { Post, PostI } from '../../posts'
import config from '../../config/user.json'

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

const graphQLRequest = ({ query, bearer = null, variables = null }) => {
  return request(app)
    .post('/graphql')
    .set('authorization', bearer)
    .send({
      variables,
      query
    })
}

const login = ({ username, password }, returnValues = `{
  token
}`) => {
  return graphQLRequest({
    query: `
      mutation {
        login(
          username: "${username}",
          password: "${password}",
        ) ${returnValues}
      }
    `
  })
}

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

const addPhotos = ({ id, url }, bearer: string, returnValues = `{
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

const deletePhoto = ({ id }, bearer: string, returnValues = `{
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

beforeEach(async () => {
  await Photo.destroy({where: {}})
  await Post.destroy({where: {}})

  photos.forEach(async (photo: PhotoI) => {
    await Photo
      .create({
        url: photo.url,
      })
  })
})

afterAll(async () => {
  await Photo.destroy({where: {}})
  await Post.destroy({where: {}})
  sequelize.close() 
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

      const auth = await login({ username: 'admin', password: config.auth.user.reminder })

      const bearer = auth.body.data.login.token

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

      const auth = await login({ username: 'admin', password: config.auth.user.reminder })

      const bearer = auth.body.data.login.token

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