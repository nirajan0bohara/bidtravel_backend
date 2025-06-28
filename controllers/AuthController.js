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
