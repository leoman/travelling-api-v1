import { login } from '../utils'
import sequelize from '../../database'
import { authenticateUserCredentials } from '../../auth/resolvers'
import config from '../../config/user.json'

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

    it('should return an error when the the user credentials are wrong', async () => {
      return login({ username: 'wrong', password: 'password' })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors[0].message).toEqual('User credentials were incorrect')
        })
    })
  })

  describe('authenticateUserCredentials', () => {

    it('should throw a UserInputError when the wrong credentials are passed', () => {
      expect(() => {
        authenticateUserCredentials('', '')
      }).toThrow('User credentials were incorrect');
      
      expect(() => {
        authenticateUserCredentials('wrong', 'password')
      }).toThrow('User credentials were incorrect');
    })

    it('should authenticate successfully a master user against a username and password pair', () => {
      const user = authenticateUserCredentials('admin', config.auth.user.reminder)
      expect(user).toEqual('admin')
    })
  })
})