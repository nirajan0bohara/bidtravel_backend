const { BidService } = require('../services/BidService');
const { RESPONSE_MESSAGES } = require('../utils/constants');

exports.submitBid = async (req, res) => {
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
    });
  }
};

exports.acceptBid = async (req, res) => {
  try {
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
    });
  }
};