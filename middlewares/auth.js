const { RESPONSE_MESSAGES } = require("../utils/constants");
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  // Skip auth for register route
  if (req.path === "/register") return next();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: RESPONSE_MESSAGES.NO_TOKEN });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ success: false, message: RESPONSE_MESSAGES.INVALID_TOKEN });
  }
};
