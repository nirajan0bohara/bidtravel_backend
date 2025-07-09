const express = require("express");
const {
  submitBid,
  getBids,
  acceptBid,
} = require("../controllers/BidController");
const { validateBid, authenticateToken } = require("../middlewares/validate"); 

const router = express.Router();

// All routes need authentication since they access req.user
router.post("/", authenticateToken, validateBid, submitBid);
router.get("/:requestId", authenticateToken, getBids);
router.put("/:bidId/accept", authenticateToken, acceptBid);

module.exports = { bidRouter: router };