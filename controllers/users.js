// Users
// CURD - create upate read read delete
const User = require('../models/Users');
const asyncHandler = require('../middleware/async');
const { sendTokenWithResponse } = require('../utils/response');
const ErrorResponse = require('../utils/error');

/**
 * RegisterUser Creates new users
 * Access       Public
 * @returns     access token
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorResponse('Validation faild, check if body has name, email and password.', 400));
  }

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      role
    });
    return sendTokenWithResponse(newUser, 201, res);
  } catch (error) {
    return next(new ErrorResponse(error, 400));
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
  return sendTokenWithResponse(user, 200, res);
});

/**
 * @description Update user details (email | name) fields
 * @param req {object} the request
 * @param res {object} the response
 * @param {Function} next
 * @access Private
 * @returns updated name | email fields
 */
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return next(new ErrorResponse('Validation faild, check if body has name, email and password.'));
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { email, name }, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
});
/**
 * @description Update user password
 * @param req {object} the request
 * @param res {object} the response
 * @param {Function} next
 * @access Private
 * @returns updated password
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Validation faild, check if body has both current and new password.', 400));
  }

  try {
    // find user by logged in id
    const user = await User.findById(req.user.id).select('+password');
    var isValidPassword = await user.validateHashedPassword(currentPassword);
    if (!isValidPassword) {
      return next(new ErrorResponse('Validation faild, invalid password', 401));
    }
    user.password = newPassword;
    await user.save();
    sendTokenWithResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 401));
  }
});
