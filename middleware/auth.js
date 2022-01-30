const ErrorResponse = require('../utils/error');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/Users');
const asyncHandler = require('./async');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // check token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route.', 401));
  }
  // decode and read the token
  try {
    const verifyToken = jsonWebToken.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verifyToken.id);
    if (!req.user) {
      return next(new ErrorResponse('user not found', 400));
    }
    next();
  } catch (error) {
    return next(new ErrorResponse(error, 401));
  }
});
