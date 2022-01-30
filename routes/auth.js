const express = require('express');

const { registerUser, signInUser, updateUserDetails, updateUserPassword } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/signin', signInUser);
router.put('/update', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);

module.exports = router;
