import { graphQLRequest, asyncForEach } from '../utils'
import sequelize from '../../database'
import { Post, PostI, Status } from '../../posts'
import { Location, LocationI } from '../../locations'
import config from '../../config/user.json'
import { post } from 'superagent'

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
  location
  lat
  lng
  duration
  hideFromBounding
}`) => {
  return graphQLRequest({
    query: `
      mutation {
        addPost(
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

const editPost = ({ id, title, titleColour, content, date, order, photo, status, location, lat, lng, duration, hideFromBounding }, bearer: string, returnValues = `{
  id
  title
  titleColour
  content
  date
  order
  photo
  status
  location
  lat
  lng
  duration
  hideFromBounding
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
            ...post,
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
            ...post,
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

  // describe('get post', () => {

  // })
})