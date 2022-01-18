const server = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

const should = chai.should();

chai.use(chaiHttp);

describe('/ check index', () => {
  it('it should return 200', (done) => {
    chai
      .request(server)
      .get('/api/v1/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
