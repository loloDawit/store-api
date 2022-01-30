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
        success: false,
        error: {
          message: 'Validation faild, check if body has name, email and password.',
          error: 'Validation faild, check if body has name, email and password.',
          statusCode: 400
        }
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
        success: false,
        error: {
          message: 'Validation faild, check if body has name, email and password.',
          error: 'Validation faild, check if body has name, email and password.',
          statusCode: 400
        }
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
        success: false,
        error: {
          message: 'Validation faild, check if body has name, email and password.',
          error: 'Validation faild, check if body has name, email and password.',
          statusCode: 400
        }
      };
      const actual = response.body;
      expect(actual).toMatchObject(expected);
    });
    it('Should throw 400 with error message when name is max than allowed', async () => {
      let user = {
        name: 'testusertestuser',
        email: 'testuser@gmail.com',
        password: 'passw0$rd'
      };
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      let expected = {
        success: false,
        error: {
          message: 'User validation failed: name: Name can not be more than 15 char',
          error: 'User validation failed',
          statusCode: 400
        }
      };
      expect(response.body).toMatchObject(expected);
    });
    it('should throw 400 with error message when password is less than eight charactor', async () => {
      let user = {
        name: 'testuser',
        email: 'testuser@gmail.com',
        password: 'bm'
      };
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      let expected = {
        success: false,
        error: {
          message:
            'User validation failed: password: Path `password` (`bm`) is shorter than the minimum allowed length (8).',
          error: 'User validation failed',
          statusCode: 400
        }
      };
      expect(response.body).toMatchObject(expected);
    });
    it('Should throw 400 with error message when email is formatted badly', async () => {
      let user = {
        name: 'testUser',
        email: 'testuser.com',
        password: 'passw0$rd'
      };
      const response = await request.post('/api/v1/auth/register').send(user);
      expect(response.status).toBe(400);
      let expected = {
        success: false,
        error: {
          message: 'User validation failed: email: Please use a valid email',
          error: 'User validation failed',
          statusCode: 400
        }
      };
      expect(response.body).toMatchObject(expected);
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
      const expected = { access: 'user', apiOwner: 'api.v1' };
      const actual = response.body.scope;
      expect(actual).toMatchObject(expected);
      expect(response.body.success).toBeTruthy();
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('scope');
      expect(response.body).toHaveProperty('expiresIn');
    });
    // it('should throw an error message when email address and password are missing', )
  });
});
