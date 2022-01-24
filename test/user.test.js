const app = require('../app');
const server = require('../server');
const { disconnectDataBase } = require('../config/db');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
require('dotenv').config();

describe('API test', () => {
  afterAll(async () => {
    await mongoose.connection.collections.users.drop();
    await disconnectDataBase();
    server.close();
  });
  let user = {
    name: 'testuser',
    email: 'testuser@gmail.com',
    password: 'passw0$rd'
  };
  describe('POST /api/v1/register', () => {
    it('should create a new user', async () => {
      // await User.create(user);
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(201);
      const expected = { access: 'user', apiOwner: 'api.v1' };
      const actual = response.body.scope;
      expect(actual).toMatchObject(expected);
      expect(response.body.success).toBeTruthy();
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('scope');
      expect(response.body).toHaveProperty('expiresIn');
    });
    it('should throw 400 with error message when email and password is missing', async () => {
      // await User.create(user);
      user = {
        name: 'testUserx'
      };
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      const expected = {
        message: 'Validation faild, check if body has name, email and password.',
        error: 'Validation faild, check if body has name, email and password.'
      };
      const actual = response.body;
      expect(actual).toMatchObject(expected);
    });
    it('should throw 400 with error message when name and password is missing', async () => {
      // await User.create(user);
      user = {
        email: 'testuser@gmail.com'
      };
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      const expected = {
        message: 'Validation faild, check if body has name, email and password.',
        error: 'Validation faild, check if body has name, email and password.'
      };
      const actual = response.body;
      expect(actual).toMatchObject(expected);
    });
    it('should throw 400 with error message when body is missing', async () => {
      // await User.create(user);
      user = {};
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      const expected = {
        message: 'Validation faild, check if body has name, email and password.',
        error: 'Validation faild, check if body has name, email and password.'
      };
      const actual = response.body;
      expect(actual).toMatchObject(expected);
    });
  });
  describe('POST /api/v1/signin', () => {
    let body = {
      email: 'testuser@gmail.com',
      password: 'passw0$rd'
    };
    it('should login user with status code 200 ', async () => {
      const response = await request.post('/api/v1/auth/signin').send(body);
      expect(response.status).toBe(200);
    });
  });
});
