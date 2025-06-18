const { UserService } = require('../services/UserService');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.getProfile = async (req, res) => {
  try {
    const user = await UserService.getProfile(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await UserService.updateProfile(req.user.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const users = await UserService.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};

exports.verifyAgency = async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    await UserService.verifyAgency(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || RESPONSE_MESSAGES.SERVER_ERROR });
  }
};