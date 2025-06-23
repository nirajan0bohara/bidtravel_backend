const express = require("express");
const {
  submitBid,
  getBids,
  acceptBid,
} = require("../controllers/BidController");
const { validateBid } = require("../middlewares/validate");

const router = express.Router();

router.post("/", validateBid, submitBid);
router.get("/:requestId", getBids);
router.put("/:bidId/accept", acceptBid);

module.exports = { bidRouter: router };
