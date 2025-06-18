const express = require('express');
const { createRequest, getUserRequests, getRequestsByLocation } = require('../controllers/RequestController');
const { authMiddleware } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');

const router = express.Router();

router.post('/', authMiddleware, validateRequest, createRequest);
router.get('/user', authMiddleware, getUserRequests);
router.get('/location', authMiddleware, getRequestsByLocation);

module.exports = { requestRouter: router };