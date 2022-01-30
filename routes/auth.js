const express = require('express');

const { registerUser, signInUser, updateUserDetails } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/signin', signInUser);
router.put('/update', protect, updateUserDetails);

module.exports = router;
