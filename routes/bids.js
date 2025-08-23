const express = require("express");
const {
  submitBid,
  getBids,
  getAgencyBids,
  acceptBid,
} = require("../controllers/BidController");
const { validateBid, authenticateToken } = require("../middlewares/validate");

const router = express.Router();

// All routes require authentication
router.post("/", authenticateToken, validateBid, submitBid); // Add bid (agency)
router.get("/agency", authenticateToken, getAgencyBids); // See agency bids
router.get("/:requestId", authenticateToken, getBids); // Fetch bids for user
router.put("/:bidId/accept", authenticateToken, acceptBid); // Accept bid (user)

module.exports = { bidRouter: router };
