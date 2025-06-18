const express = require('express');
const { assignCredits, getAgencyCredits } = require('../controllers/CreditController');
const { authMiddleware } = require('../middlewares/auth');
const { validateCredits } = require('../middlewares/validate');

const router = express.Router();

router.put('/:agencyId', authMiddleware, validateCredits, assignCredits);
router.get('/:agencyId', authMiddleware, getAgencyCredits);

module.exports = { creditRouter: router };