const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('App Test', () => {
  // Close database connection after all tests so Jest process can exit properly
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toEqual(404);
  });
});
