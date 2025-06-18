const express = require('express');
const { login, register } = require('../controllers/AuthController');
const { validateLogin, validateRegister } = require('../middlewares/validate');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);

module.exports = { authRouter: router };