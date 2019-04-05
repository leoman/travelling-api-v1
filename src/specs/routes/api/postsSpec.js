const request = require('supertest');
const nock = require('nock');
const config = require('../../../utils/configurer');
const app = require('../../../app');

const urlPrefix = config.get('api:urlPrefix');

describe('betslip (asyncbs) router', () => {
  it('successfully prepares a betslip model', (done) => {
    const path = `${urlPrefix}/v1`;
    nock(config.get('services:mify:v1:url'))
      .put('/asyncbs')
      .reply(200, {});
    request(app)
      .put(`${path}/asyncbs`)
      .set({ 'x-lvs-hstoken': 'HS-Token-1' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  it('successfully creates a betslip model', (done) => {
    const path = `${urlPrefix}/v1`;
    nock(config.get('services:mify:v1:url'))
      .post('/acc/1234/asyncbs')
      .reply(201, {});
    request(app)
      .post(`${path}/acc/1234/asyncbs`)
      .set({ 'x-lvs-hstoken': 'HS-Token-1' })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  it('successfully creates a betslip model with X-LVS-WaitForResponse-Millis headers', (done) => {
    const path = `${urlPrefix}/v1`;
    nock(config.get('services:mify:v1:url'))
      .post('/acc/1234/asyncbs')
      .reply(200, {});
    request(app)
      .post(`${path}/acc/1234/asyncbs`)
      .set({ 'x-lvs-hstoken': 'HS-Token-1', 'x-lvs-waitforresponse-millis': '500' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  it('successfully checks a betslip model', (done) => {
    const path = `${urlPrefix}/v1`;
    nock(config.get('services:mify:v1:url'))
      .get('/acc/1234/asyncbs/56789')
      .reply(200, {});
    request(app)
      .get(`${path}/acc/1234/asyncbs/56789`)
      .set({ 'x-lvs-hstoken': 'HS-Token-1' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  it('successfully confirms a betslip model', (done) => {
    const path = `${urlPrefix}/v1`;
    nock(config.get('services:mify:v1:url'))
      .put('/acc/1234/asyncbs/56789')
      .reply(201, {});
    request(app)
      .put(`${path}/acc/1234/asyncbs/56789`)
      .set({ 'x-lvs-hstoken': 'HS-Token-1' })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });
});
