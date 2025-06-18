const express = require('express');
const { submitBid, getBids, acceptBid } = require('../controllers/BidController');
const { authMiddleware } = require('../middlewares/auth');
const { validateBid } = require('../middlewares/validate');

const router = express.Router();

router.post('/', authMiddleware, validateBid, submitBid);
router.get('/:requestId', authMiddleware, getBids);
router.put('/:bidId/accept', authMiddleware, acceptBid);

module.exports = { bidRouter: router };