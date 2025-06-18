const express = require('express');
const { getProfile, updateProfile, getAllUsers, verifyAgency } = require('../controllers/UserController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/', authMiddleware, getAllUsers);
router.put('/:id/verify', authMiddleware, verifyAgency);

module.exports = { userRouter: router };