import request from 'supertest';
import app from '../../server'
import config from '../../config/user.json'

interface graphQLRequestParams {
  query: string
  bearer?: string
  variables?: any
}

export const graphQLRequest = ({ query, bearer = '', variables = null }: graphQLRequestParams ) => {
  return request(app)
    .post('/graphql')
    .set('authorization', bearer)
    .send({
      variables,
      query
    })
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const login = ({ username, password }: { username: string, password: string }, returnValues = `{
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

export const getJWToken = async (): Promise<string> => {
  const auth = await login({ username: 'admin', password: config.auth.user.reminder })
  return auth.body.data.login.token
}
