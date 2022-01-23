// Users
// CURD - create upate read read delete
const User = require('../models/Users');
const asyncHandler = require('../middleware/async');
const { sendTokenResponse } = require('../utils/response');
const ErrorResponse = require('../utils/error');

/**
 * RegisterUser Creates new users
 * Access       Public
 * @returns     access token
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    let error = new ErrorResponse('Validation faild, check if body has name, email and password.', 400);
    res.status(400).json(error);
    return next();
  }
 
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });
    return sendTokenResponse(newUser, 201, res);
  } catch (error) {
    let err = new ErrorResponse(error);
    res.status(400).json({ err });
  }
});

exports.signInUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Validation failed, check you have the correct password and email', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Validation failed, Invalid password/email', 400));
  }
  // validate password
  const comparePassword = await user.validateHashedPassword(password);
  if (!comparePassword) {
    return next(new ErrorResponse('Validation failed, Invalid password/email', 400));
  }
  return sendTokenResponse(user, 200, res);
});
