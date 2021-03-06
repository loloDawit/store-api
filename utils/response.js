const moment = require('moment');
/**
 * sendTokenWithResponse generates new token and send json response with token
 * @param {*} user newly created user
 * @param {*} statusCode http status code 
 * @param {*} response with token
 */
exports.sendTokenWithResponse = (user, statusCode, response) => {
  const token = user.getSignedJWT();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_DATE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  var expiresIn = moment(options.expires).format('dddd, MMMM Do YYYY, h:mm:ss a');

  var scope = {
    apiOwner: 'api.v1',
    access: user.role
  };
  if (process.env.NODE_ENV === 'production') {
    options.sercure = true;
  }

  response.status(statusCode).cookie('token', token, options).json({
    success: true,
    accessToken: token,
    expiresIn: expiresIn,
    scope
  });
};
