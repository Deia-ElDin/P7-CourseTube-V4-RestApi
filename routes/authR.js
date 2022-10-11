const express = require('express');
const router = express.Router();
const { register, login, handleToken } = require('../controllers/authC');

router.post('/register', register);
router.post('/login', login);
router.get('/token', handleToken);

module.exports = router;
