import { omit } from 'lodash'
import { graphQLRequest, asyncForEach } from '../utils'
import sequelize from '../../database'
import { Post, PostI, Status } from '../../posts'
import { Location, LocationI } from '../../locations'
import config from '../../config/user.json'

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

const allPosts = (status = null) => {
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

const getPost = ({ id }) => {
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

const addPost = ({ title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, bearer: string, returnValues = `{
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

  let sentBearer: string
  let sentTitle: string = ''
  if (bearer) {
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

const editPost = ({ id, title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, bearer: string, returnValues = `{
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
          status: "${status}",
          location: "${location}",
          lat: "${lat}",
          lng: "${lng}",
          duration: "${duration}",
          hideFromBounding: "${hideFromBounding}",
        ) ${returnValues}
      }
    `,
    bearer: `bearer ${bearer}`
  })
}



const deletePost = ({ id }, bearer: string, returnValues = `{
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

      return getPost({ id: firstReturnedId })
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
      return getPost({ id: 0 })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Unable to fetch Post')
        })
    })
  })

  describe('addPost', () => {
    it('should add a new post', async () => {
      const auth = await login({ username: 'admin', password: config.auth.user.reminder })
      const bearer = auth.body.data.login.token
      const { title, titleColour, content, date, order, photo, status, location : { location, lat, lng, duration, hideFromBounding } } = newPost

      return addPost({ title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, bearer)
        .expect(res => {
          expect(res.body.data).toHaveProperty('addPost')
          expect(returnPostWithISODates(res.body.data.addPost)).toEqual(newPost)
        })
    })

    it('should return an error when fields are missing', async () => {
      const auth = await login({ username: 'admin', password: config.auth.user.reminder })
      const bearer = auth.body.data.login.token
      const { titleColour, content, date, order, photo, status, location : { location, lat, lng, duration, hideFromBounding } } = newPost
      const title = null

      return addPost({ title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, bearer)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Field "addPost" argument "title" of type "String!" is required, but it was not provided.')
        })
    })

    it('should return an error when the auth bearer is incorrect', async () => {
        const { title, titleColour, content, date, order, photo, status, location : { location, lat, lng, duration, hideFromBounding } } = newPost

      return addPost({ title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, '1234567890')
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Context creation failed: Failed to authenticate token.')
        })
    })

    it('should return an error when the auth bearer is missing', async () => {
      const { title, titleColour, content, date, order, photo, status, location : { location, lat, lng, duration, hideFromBounding } } = newPost

      return addPost({ title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, null)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in')
        })
    })
  })

})