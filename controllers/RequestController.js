const { RequestService } = require("../services/RequestService");
const { RESPONSE_MESSAGES } = require("../utils/constants");

exports.createRequest = async (req, res) => {
    console.log('Request body:', req.body);
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const { from, destination, startDate, travelers, preferences, phoneNumber } = req.body;

    // Additional validation
    if (!from || !destination || !startDate || !travelers) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const requestId = await RequestService.createRequest(req.user.id, {
      from,
      destination,
      startDate,
      travelers,
      preferences,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      requestId,
      message: "Travel request created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const requests = await RequestService.getUserRequests(req.user.id);
    res.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.getRequestsByLocation = async (req, res) => {
  try {
    if (req.user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const requests = await RequestService.getRequestsByLocation(req.user.id);
    res.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const { id } = req.params;
    const { from, destination, startDate, travelers, preferences } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const result = await RequestService.updateRequest(req.user.id, id, {
      from,
      destination,
      startDate,
      travelers,
      preferences,
    });

    res.json({
      success: true,
      message: "Travel request updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const result = await RequestService.deleteRequest(req.user.id, id);
    res.json({
      success: true,
      message: "Travel request deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    // Allow both users and agencies to update status
    if (!["user", "agency"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    // Validate status
    const validStatuses = ["open", "closed", "in_progress"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const result = await RequestService.updateRequestStatus(
      req.user.id,
      id,
      status
    );

    res.json({
      success: true,
      message: "Request status updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const request = await RequestService.getRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Travel request not found",
      });
    }

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};
