// Users
// CURD - create upate read read delete
const User = require('../models/Users');
const asyncHandler = require('../middleware/async');
const { sendTokenResponse } = require('../utils/response');

/**
 * RegisterUser Creates new users
 * @returns access token
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    role
  });
  //
  return sendTokenResponse(newUser, 201, res);
});
