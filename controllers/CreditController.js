const { CreditService } = require('../services/CreditService');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.assignCredits = async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    await CreditService.assignCredits(req.params.agencyId, req.body.credits);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.getAgencyCredits = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.agencyId)) {
      throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    }
    const credits = await CreditService.getAgencyCredits(req.params.agencyId);
    res.json({ success: true, credits });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};