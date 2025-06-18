const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.validateLogin = (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !['user', 'agency', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateRegister = (req, res, next) => {
  const { email, password, name, role, location } = req.body;
  if (!email || !password || !name || !['user', 'agency'].includes(role) || (role === 'agency' && !location)) {
    return res.status(400).json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateRequest = (req, res, next) => {
  const { destination, startDate, travelers } = req.body;
  if (!destination || !startDate || !travelers) {
    return res.status(400).json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateBid = (req, res, next) => {
  const { requestId, price, packageDetails } = req.body;
  if (!requestId || !price || !packageDetails) {
    return res.status(400).json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateCredits = (req, res, next) => {
  const { credits } = req.body;
  if (!credits || credits <= 0) {
    return res.status(400).json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};