// Users
// CURD - create upate read read delete
const User = require('../models/Users');
const asyncHandler = require('../middleware/async');
const { sendTokenWithResponse } = require('../utils/response');
const ErrorResponse = require('../utils/error');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');

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
  console.log('im here', req);
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
  // TODO should only check if either exist not both neccessorly
  // email only should work
  // name only should work
  // both should work
  if (Object.keys(req.body).length === 0) {
    return next(new ErrorResponse('Validation faild, check if body has either name or email.'));
  }
  try {
    // where and how is user id set?
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

exports.resetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse('Validation faild, invalid email.', 400));
  }
  try {
    const user = await User.findOne({ email });
    const resetToken = user.getPasswordResetToken();
    await user.save({
      validateBeforeSave: false
    });
    // creat reset url
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `<!doctype html>
    <html ang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password</title>
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hi there,</h1>
          <p>A password reset was requested for this email address <b>${email}</b>. If you requested this reset, click
          the link below to reset your password.</p>
          <p><a href="$${resetURL}}">Reset Your Password</a></p>
        </div>
        <style>
          .main { background-color: white; }
          a:hover { border-left-width: 1em; min-height: 2em; }
        </style>
      </body>
    </html>`;

    await sendEmail({
      email,
      subject: 'Password Reset',
      message
    });
    res.status(200).json({
      success: true,
      data: 'Email Sent'
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(error, 400));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token) {
    return next(new ErrorResponse('Token missing', 400));
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenWithResponse(user, 200, res);
});
