// Users
// CURD - create upate read read delete
const User = require('../models/Users');
const asyncHandler = require('../middleware/async');

// Register user
exports.registerUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });
  //
  console.log(newUser);
});
