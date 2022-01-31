const express = require('express');

const {
  registerUser,
  signInUser,
  updateUserDetails,
  updateUserPassword,
  resetPasswordRequest,
  resetPassword
} = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/signin', signInUser);
router.put('/update', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
router.post('/resetpassword', resetPasswordRequest);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
