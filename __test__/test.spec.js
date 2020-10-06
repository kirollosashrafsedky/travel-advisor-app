const request = require('supertest')
const app = require('../src/server')
import { displayDate } from "../src/client/js/displayDate"


test('test display date function', () => {
  const date = new Date('5-5-2020');
  expect(displayDate(date)).toBe('5 May 2020');
});


describe('Post Endpoints', () => {
  it('should has property weatherData', async (done) => {
    const res = await request(app)
      .post('/postdata')
      .send({'loc': 'paris'})
    expect(res.body).toHaveProperty('weatherData')
    done();
  })
})
