const { BidService } = require('../services/BidService');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.submitBid = async (req, res) => {
  try {
    if (req.user.role !== 'agency') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const { bidId, userId } = await BidService.submitBid(req.user.id, req.body);
    req.app.get('notifyUser')(userId, { message: 'New bid received' });
    res.json({ success: true, bidId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.getBids = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const bids = await BidService.getBids(req.params.requestId);
    res.json({ success: true, bids });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.acceptBid = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    await BidService.acceptBid(req.params.bidId, req.user.id, req.app.get('notifyUser'));
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};