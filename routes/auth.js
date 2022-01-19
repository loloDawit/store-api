const express = require('express');

const { registerUser, signInUser } = require('../controllers/users');

const router = express.Router();

router.post('/register', registerUser);
router.post('/signin', signInUser);

module.exports = router;
