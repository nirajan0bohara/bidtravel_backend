const { RESPONSE_MESSAGES } = require("../utils/constants");
const jwt = require("jsonwebtoken");

//new code
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Make sure JWT_SECRET is loaded from environment
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // This creates req.user that your controller needs
      req.user = user;
      console.log("Authenticated user:", req.user); // Debug log
      next();
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
//end of new code

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateRegister = (req, res, next) => {
  const { email, password, name, role, location } = req.body;
  if (
    !email ||
    !password ||
    !name ||
    !["user", "agency"].includes(role) ||
    (role === "agency" && !location)
  ) {
    return res
      .status(400)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateRequest = (req, res, next) => {
  const { destination, startDate, travelers } = req.body;
  if (!destination || !startDate || !travelers) {
    return res
      .status(400)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateBid = (req, res, next) => {
  const { requestId, price } = req.body;
  if (!requestId || !price) {
    return res
      .status(400)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};

exports.validateCredits = (req, res, next) => {
  const { credits } = req.body;
  if (!credits || credits <= 0) {
    return res
      .status(400)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_INPUT });
  }
  next();
};
