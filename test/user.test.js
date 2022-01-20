const app = require('../app');
const server = require('../server');
const { disconnectDataBase, connectDataBase } = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/Users');
const supertest = require('supertest');
const request = supertest(app);
require('dotenv').config();

describe('API test', () => {
  afterAll(() => {
    mongoose.connection.collections.users.drop();
    disconnectDataBase();
    server.close();
  });

  describe('POST /api/v1/register', () => {
    it('should create a new user', async () => {
      const user = new User({
        name: 'dawit',
        email: 'daaaawjaaaaaaaatab64a@gmail.com',
        password: '12dsgfdsdsq'
      });
      await User.create(user);

      const response = await request
        .post('/api/v1/auth/signin')
        .send({ email: 'daaaawjaaaaaaaatab64a@gmail.com', password: '12dsgfdsdsq' });

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
