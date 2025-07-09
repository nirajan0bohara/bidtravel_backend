const { BidService } = require("../services/BidService");
const { RESPONSE_MESSAGES } = require("../utils/constants");

exports.submitBid = async (req, res) => {
  // console.log(req.user);
  try {
    // More specific error checking
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (req.user.role !== 'agency') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only agencies can submit bids' 
      });
    }
    
    console.log('Submitting bid for agency:', req.user.id);
    console.log('Request body:', req.body);
    
    const { bidId, userId } = await BidService.submitBid(req.user.id, req.body);
    req.app.get('notifyUser')(userId, { message: 'New bid received' });
    
    res.json({ success: true, bidId });
  } catch (err) {
    console.error('Submit bid error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR 
    });
  }
};

exports.getBids = async (req, res) => {
  try {
<<<<<<< HEAD
    if (req.user.role !== "user")
      throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    const bids = await BidService.getBids(req.params.requestId);
    res.json({ success: true, bids });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
=======
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (req.user.role !== 'user') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only users can view bids' 
      });
    }
    
    const bids = await BidService.getBids(req.params.requestId);
    res.json({ success: true, bids });
  } catch (err) {
    console.error('Get bids error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR 
>>>>>>> 4a238dfb422a2fb2259486f06e451ff75da05944
    });
  }
};

exports.acceptBid = async (req, res) => {
  try {
<<<<<<< HEAD
    if (req.user.role !== "user")
      throw new Error(RESPONSE_MESSAGES.UNAUTHORIZED);
    await BidService.acceptBid(
      req.params.bidId,
      req.user.id,
      req.app.get("notifyUser")
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
=======
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (req.user.role !== 'user') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only users can accept bids' 
      });
    }
    
    await BidService.acceptBid(req.params.bidId, req.user.id, req.app.get('notifyUser'));
    res.json({ success: true });
  } catch (err) {
    console.error('Accept bid error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR 
>>>>>>> 4a238dfb422a2fb2259486f06e451ff75da05944
    });
  }
};
