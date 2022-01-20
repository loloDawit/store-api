const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/Users');
const supertest = require('supertest');
require('dotenv').config();

mongoose.Promise = global.Promise;

beforeEach((done) => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});
//Called hooks which runs before something.
afterEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    done();
  });
});

test('POST /api/v1/auth/register', async () => {
  const user = new User({
    name: 'dawit',
    email: 'daaaawjaaaaaaaatab64a@gmail.com',
    password: '12dsgfdsdsq'
  });
  const newUser = await User.create(user);

  await supertest(app)
    .post('/api/v1/auth/signin')
    .send({ email: 'daaaawjaaaaaaaatab64a@gmail.com', password: '12dsgfdsdsq' })
    .expect(200)
    .then((response) => {
      const expected = { access: 'user', apiOwner: 'api.v1' };
      const actual = response.body.scope;
      expect(actual).toMatchObject(expected);
      expect(response.body.success).toBeTruthy();
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('scope');
      expect(response.body).toHaveProperty('expiresIn');
    });
});
