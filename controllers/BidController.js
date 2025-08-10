const { BidService } = require("../services/BidService");
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

    console.log("Submitting bid for agency:", req.user.id);
    console.log("Request body:", req.body);

    const { bidId, userId } = await BidService.submitBid(req.user.id, req.body);
    req.app.get("notifyUser")(userId, { message: "New bid received" });

    res.json({ success: true, bidId });
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
        message: 'Authentication required' 
      });
    }
    
    if (req.user.role !== 'agency') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only agencies can view their own bids' 
      });
    }
    
    const { requestId } = req.params;
    if (!requestId || isNaN(requestId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request ID' 
      });
    }

    const request = await models.TravelRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Travel request not found' 
      });
    }

    const bids = await models.Bid.findAll({
      where: { requestId, agencyId: req.user.id },
      include: [{ model: models.User, as: 'User', attributes: ['name', 'rating'] }],
    });

    res.json({ success: true, bids: bids.map(bid => bid.toJSON()) });
  } catch (err) {
    console.error('Get agency bids error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR 
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

    await BidService.acceptBid(
      req.params.bidId,
      req.user.id,
      req.app.get("notifyUser")
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Accept bid error:", err);
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};
