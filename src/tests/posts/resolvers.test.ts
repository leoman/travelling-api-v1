import { omit } from 'lodash'
import { graphQLRequest, asyncForEach, getJWToken } from '../utils'
import sequelize from '../../database'
import { Post, PostI, Status } from '../../posts'
import { Location } from '../../locations'

const posts: PostI[] = [
  {
    title: 'My first post',
    titleColour: '#fff',
    content: 'I am your father',
    date: new Date(1592733214700).toISOString(),
    order: new Date(1592733214700).toISOString(),
    photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
    status: Status.live,
    location: {
      location: 'Valparaiso',
      lat: -33.045559,
      lng: -71.619423,
      duration: 0,
      hideFromBounding: false
    }
  },
  {
    title: 'My second post',
    titleColour: '#fff',
    content: 'I am your father',
    date: new Date(1592733199360).toISOString(),
    order: new Date(1592733199360).toISOString(),
    photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
    status: Status.draft,
    location: {
      location: 'Valparaiso',
      lat: -33.045559,
      lng: -71.619423,
      duration: 0,
      hideFromBounding: false
    }
  }
]

const newPost: PostI = {
  title: 'My third post',
  titleColour: '#fff',
  content: 'I am your father',
  date: new Date(1592750588797).toISOString(),
  order: new Date(1592750588797).toISOString(),
  photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
  status: Status.draft,
  location: {
    location: 'Valparaiso',
    lat: -33.045559,
    lng: -71.619423,
    duration: 0,
    hideFromBounding: false
  }
}

const editedPost = {
  ...newPost,
  title: 'An edited post'
}

const allPosts = (status: string | null = null) => {
  let where = ''
  if (status) {
    where = `(status: "${status}")`
  }

  return graphQLRequest({
    query: `
      query {
        allPosts${where} {
          id
          title
          titleColour
          content
          date
          order
          photo
          status
          location {
            location
            lat
            lng
            duration
            hideFromBounding
          }
        }
      }
    `
  })
}

const getPost = ( id: number ) => {
  return graphQLRequest({
    query: `
      query {
        post(
          id: "${id}"
        ) {
          title
          titleColour
          content
          date
          order
          photo
          status
          location {
            location
            lat
            lng
            duration
            hideFromBounding
          }
        }
      }
    `
  })
}

const addPost = ({ title, titleColour, content, date, order, photo, status, location: { location, lat, lng, duration, hideFromBounding } }: PostI, bearer: string, returnValues = `{
  id
  title
  titleColour
  content
  date
  order
  photo
  status
  location {
    location
    lat
    lng
    duration
    hideFromBounding
  }
}`) => {

  let sentBearer: string = ''
  let sentTitle: string = ''
  if (bearer && bearer !== '') {
    sentBearer = `bearer ${bearer}`
  }

  if (title) {
    sentTitle = `title: "${title}",`
  }

  return graphQLRequest({
    query: `
      mutation {
        addPost(
          ${sentTitle}
          titleColour: "${titleColour}",
          content: "${content}",
          date: "${date}",
          order: "${order}",
          photo: "${photo}",
          status: ${status},
          location: "${location}",
          lat: ${lat},
          lng: ${lng},
          duration: ${duration},
          hideFromBounding: ${hideFromBounding},
        ) ${returnValues}
      }
    `,
    bearer: sentBearer
  })
}

const editPost = ({ id, title, titleColour, content, date, order, photo, status, location: { location, lat, lng, duration, hideFromBounding } }: PostI, bearer: string, returnValues = `{
  id
  title
  titleColour
  content
  date
  order
  photo
  status
  location {
    location
    lat
    lng
    duration
    hideFromBounding
  }
}`) => {

  let sentBearer: string = ''
  if (bearer && bearer !== '') {
    sentBearer = `bearer ${bearer}`
  }

  return graphQLRequest({
    query: `
      mutation {
        editPost(
          id: "${id}",
          title: "${title}",
          titleColour: "${titleColour}",
          content: "${content}",
          date: "${date}",
          order: "${order}",
          photo: "${photo}",
          status: ${status},
          location: "${location}",
          lat: ${lat},
          lng: ${lng},
          duration: ${duration},
          hideFromBounding: ${hideFromBounding},
        ) ${returnValues}
      }
    `,
    bearer: sentBearer
  })
}



const deletePost = (id: number, bearer: string, returnValues = `{
  success
}`) => {
  return graphQLRequest({
    query: `
      mutation {
        deletePost(
          id: "${id}",
        ) ${returnValues}
      }
    `,
    bearer: `bearer ${bearer}`
  })
}

const returnPostWithISODates = (post: PostI) => ({
  ...post,
  date: new Date(Number(post.date)).toISOString(),
  order: new Date(Number(post.order)).toISOString(),
})

beforeEach(async (done) => {
  await Post.destroy({where: {}})
  await Location.destroy({where: {}})

  await asyncForEach(posts, async (post: PostI) => {
    
    try {
      const location = await Location
        .create({
          ...post.location
        })

      const newPost = await Post
        .create({
          ...post
        }
      )

      return await newPost.setLocation(location)
    } catch(error) {
      console.log(error)
    }
  })
  done()
})

afterAll(async () => {
  await Post.destroy({where: {}})
  await Location.destroy({where: {}})
  sequelize.close()
})

describe('photos', () => {
  describe('allPosts', () => {
    it('should return all the posts', () => {
      return allPosts()
        .expect(res => {
          const returnedPosts = res.body.data.allPosts.map((post: PostI) => ({
            ...omit(post, ['id']),
            date: new Date(Number(post.date)).toISOString(),
            order: new Date(Number(post.order)).toISOString(),
          }))
          expect(res.body).toHaveProperty('data.allPosts')
          expect(res.body.data.allPosts.length).toEqual(2)
          expect(returnedPosts).toEqual(posts)
        })
        .expect(200)
    })

    it('should return all the posts by status', () => {
      return allPosts(Status.live)
        .expect(res => {
          const returnedPosts = res.body.data.allPosts.map((post: PostI) => ({
            ...omit(post, ['id']),
            date: new Date(Number(post.date)).toISOString(),
            order: new Date(Number(post.order)).toISOString(),
          }))
          expect(res.body).toHaveProperty('data.allPosts')
          expect(res.body.data.allPosts.length).toEqual(1)
          expect(returnedPosts).toEqual(posts.filter(post => post.status === Status.live))
        })
        .expect(200)
    })
  })

  describe('get post', () => {
    it('should return a specfic post by ID', async () => {
      const returnedAllPosts = await allPosts()
      const firstReturnedId = returnedAllPosts.body.data.allPosts[0].id

      return getPost(firstReturnedId)
        .expect(res => {
          const returnedPost = res.body.data.post
          const updatedPost = {
            ...res.body.data.post,
            date: new Date(Number(returnedPost.date)).toISOString(),
            order: new Date(Number(returnedPost.order)).toISOString(),
          }
          expect(res.body).toHaveProperty('data.post')
          expect(updatedPost).toEqual(posts[0])
        })
        .expect(200)

    })

    it('should return an error when the ID cannot be found', async () => {
      return getPost(0)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Unable to fetch Post')
        })
    })
  })

  describe('addPost', () => {
    it('should add a new post', async () => {
      const bearer = await getJWToken()

      return addPost(newPost, bearer)
        .expect(res => {

          const returnedPost :PostI = res.body.data.addPost
          const omittedPost = omit(returnedPost, ['id'])

          expect(res.body.data).toHaveProperty('addPost')
          expect(returnPostWithISODates(omittedPost)).toEqual(newPost)
        })
    })

    it('should return an error when fields are missing', async () => {
      const bearer = await getJWToken()

      const modifiedPost = {
        ...newPost,
        title: null
      }

      return addPost(modifiedPost, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Field "addPost" argument "title" of type "String!" is required, but it was not provided.')
        })
    })

    it('should return an error when the auth bearer is incorrect', async () => {
      return addPost(newPost, '1234567890')
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Context creation failed: Failed to authenticate token.')
        })
    })

    it('should return an error when the auth bearer is missing', async () => {
      return addPost(newPost, '')
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in')
        })
    })
  })

  describe('editPost', () => {

    it('should edit an existing post', async () => {

      const bearer = await getJWToken()
      const returnedAllPosts = await allPosts()
      const firstReturnedId = returnedAllPosts.body.data.allPosts[0].id

      const postToEdit = {
        id: firstReturnedId,
        ...editedPost
      }

      return editPost(postToEdit, bearer)
        .expect(res => {
          expect(res.body.data).toHaveProperty('editPost')
          expect(returnPostWithISODates(res.body.data.editPost)).toEqual(postToEdit)
        })

    })

    it('should return an error if the post ID doesnt match', async () => {
      const bearer = await getJWToken()

      const postToEdit = {
        id: 0,
        ...editedPost
      }

      return editPost(postToEdit, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Unable to update Post with ID: 0')
        })
    })

    it('should return an error if the auth fails', async () => {

      const returnedAllPosts = await allPosts()
      const firstReturnedId = returnedAllPosts.body.data.allPosts[0].id

      const postToEdit = {
        id: firstReturnedId,
        ...editedPost
      }

      return editPost(postToEdit, '')
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in')
        })
    })

  })

  describe('deletePost', () => {

    it('should not delete a post when auth fails', async () => {
      const returnedAllPosts = await allPosts()
      const firstReturnedId = returnedAllPosts.body.data.allPosts[0].id

      return deletePost(firstReturnedId, '')
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in')
        })
    })

    it('should not delete a post when the ID doesnt match', async () => {
      const bearer = await getJWToken()

      return deletePost(0, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('No Post found with ID: 0')
        })
    })

    it('should delete a post', async () => {
      const bearer = await getJWToken()
      const returnedNewPost = await addPost(newPost, bearer)
      const newPostId = returnedNewPost.body.data.addPost.id

      await allPosts()
        .expect(res => {
          expect(res.body).toHaveProperty('data.allPosts')
          expect(res.body.data.allPosts.length).toEqual(3)
        })
        .expect(200)

      await deletePost(newPostId, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('data.deletePost')
          expect(res.body.data.deletePost.success).toEqual(true)
        })
        .expect(200)

      return allPosts()
        .expect(res => {
          expect(res.body).toHaveProperty('data.allPosts')
          expect(res.body.data.allPosts.length).toEqual(2)
        })
        .expect(200)
    })
  })

})