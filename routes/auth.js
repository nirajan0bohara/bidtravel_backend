const express = require('express');
const { login, register, verifyEmail, forgotPassword, resetPassword } = require('../controllers/AuthController');
const { validateLogin, validateRegister } = require('../middlewares/validate');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = { authRouter: router };