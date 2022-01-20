const app = require('../app');
const server = require('../server');
const { disconnectDataBase } = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/Users');
const supertest = require('supertest');
const request = supertest(app);
require('dotenv').config();

describe('API test', () => {
  afterAll(async () => {
    await mongoose.connection.collections.users.drop();
    // await disconnectDataBase();
    // server.close();
  });

  describe('POST /api/v1/register', () => {
    it('should create a new user', async () => {
      const user = new User({
        name: 'dawit',
        email: 'testuser@gmail.com',
        password: 'passw0$rd'
      });
      await User.create(user);

      const response = await request
        .post('/api/v1/auth/signin')
        .send({ email: 'testuser@gmail.com', password: 'passw0$rd' });

      expect(response.status).toBe(200);

      const expected = { access: 'user', apiOwner: 'api.v1' };
      const actual = response.body.scope;
      expect(actual).toMatchObject(expected);
      expect(response.body.success).toBeTruthy();
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('scope');
      expect(response.body).toHaveProperty('expiresIn');
    });
  });
});
