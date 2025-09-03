const { AuthService } = require("../services/AuthService");
const { RESPONSE_MESSAGES } = require("../utils/constants");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, location, role, phoneNumber } = req.body; // Added phoneNumber
    const result = await AuthService.register(
      email,
      password,
      name,
      location,
      role,
      phoneNumber // Pass phoneNumber
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

const { models } = require('../models');
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (!user.verificationToken) {
      return res.status(400).json({ success: false, message: 'No OTP sent or already verified.' });
    }

    // Debug log for OTP comparison
    console.log('DB token:', user.verificationToken, 'OTP:', otp);
    if (user.verificationToken.toString() !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    await user.update({ isVerified: true, verificationToken: null });
    return res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await AuthService.resetPassword(email, otp, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
