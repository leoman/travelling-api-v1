import { graphQLRequest } from '../utils'
import sequelize from '../../database'
import { authenticateUserCredentials } from '../../auth/resolvers'
import config from '../../config/user.json'

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

afterAll(async () => {
  sequelize.close() 
})

describe('auth', () => {
  describe('login', () => {
    it('should return a JWT', () => {

      return login({ username: 'admin', password: config.auth.user.reminder })
      .expect(res => {
        expect(res.body).toHaveProperty('data.login')
        expect(res.body.data.login).toHaveProperty('token')
      })
      .expect(200)
    })
  })

  describe('authenticateUserCredentials', () => {

    it('should throw a UserInputError when the wrong credentials are passed', () => {
      expect(() => {
        const user = authenticateUserCredentials('', '')
      }).toThrow('User credentials were incorrect');
      
      expect(() => {
        const user = authenticateUserCredentials('wrong', 'password')
      }).toThrow('User credentials were incorrect');
    })

    it('should authenticate successfully a master user against a username and password pair', () => {
      const user = authenticateUserCredentials('admin', config.auth.user.reminder)
      expect(user).toEqual('admin')
    })
  })
})