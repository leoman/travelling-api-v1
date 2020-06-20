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