const { RequestService } = require('../services/RequestService');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const requestId = await RequestService.createRequest(req.user.id, req.body);
    res.json({ success: true, requestId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const requests = await RequestService.getUserRequests(req.user.id);
    res.json({ success: true, requests });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.getRequestsByLocation = async (req, res) => {
  try {
    if (req.user.role !== 'agency') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const requests = await RequestService.getRequestsByLocation(req.user.id);
    res.json({ success: true, requests });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const { id } = req.params;
    const { from, destination, startDate, travelers, preferences } = req.body;
    const result = await RequestService.updateRequest(req.user.id, id, { from, destination, startDate, travelers, preferences });
    res.json({ success: true, message: 'Travel request updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== 'user') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const { id } = req.params;
    const result = await RequestService.deleteRequest(req.user.id, id);
    res.json({ success: true, message: 'Travel request deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};