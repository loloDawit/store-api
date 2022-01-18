const express = require('express');

const { registerUser } = require('../controllers/users');

const router = express.Router();

router.post('/register', registerUser);

module.exports = router;
