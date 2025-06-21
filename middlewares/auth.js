const jwt = require('jsonwebtoken');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("Token:", token);
  if (!token) return res.status(401).json({ success: false, message: RESPONSE_MESSAGES.NO_TOKEN });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: RESPONSE_MESSAGES.INVALID_TOKEN });
  }
};