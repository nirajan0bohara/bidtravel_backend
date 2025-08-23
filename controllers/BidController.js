const { BidService } = require("../services/BidService");
const { models } = require("../models");
const { RESPONSE_MESSAGES } = require("../utils/constants");

exports.submitBid = async (req, res) => {
  // console.log(req.user);
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only agencies can submit bids",
      });
    }

    const bid = await BidService.submitBid(
      { id: req.user.id, name: req.user.name },
      req.body,
      res
    );

    if (bid.duplicate) {
      return res.status(200).json({
        success: true,
        message: "Bid already exists",
        data: bid.data,
      });
    }

    req.app.get("notifyUser")(bid.userId, { message: "New bid received" });

    res.json({ success: true, data: bid });
  } catch (err) {
    console.error("Submit bid error:", err);
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.getBids = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can view bids",
      });
    }

    const bids = await BidService.getBids(req.params.requestId);
    res.json({ success: true, bids });
  } catch (err) {
    console.error("Get bids error:", err);
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.getAgencyBids = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only agencies can view their own bids",
      });
    }

    const agencyId = req.user.id;
    if (!req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Invalid agency ID",
      });
    }

    const bids = await models.Bid.findAll({
      where: { agencyId: agencyId },
      include: [
        { model: models.User, as: "Agency", attributes: ["name", "rating"] },
      ],
    });

    res.json({ success: true, bids: bids.map((bid) => bid.toJSON()) });
  } catch (err) {
    console.error("Get agency bids error:", err);
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.acceptBid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can accept bids",
      });
    }

    const bid = await BidService.acceptBid(
      req.params.bidId,
      req.user.id,
      req.app.get("notifyUser")
    );

    res.json({
      success: true,
      message: "bid accepted successfully",
      data: bid,
    });
  } catch (err) {
    console.error("Accept bid error:", err);
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};
