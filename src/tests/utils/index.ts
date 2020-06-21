import request from 'supertest';
import app from '../../server'

export const graphQLRequest = ({ query, bearer = null, variables = null }) => {
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