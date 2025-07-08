const express = require("express");
const {
  createRequest,
  getUserRequests,
  getRequestsByLocation,
  updateRequest,
  deleteRequest,
  getRequestById,
  updateRequestStatus,
} = require("../controllers/RequestController");
const { validateRequest } = require("../middlewares/validate");
const { authMiddleware } = require("../middlewares/auth"); // Corrected import

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new travel request (POST /api/requests)
router.post("/", validateRequest, createRequest);

// Get all travel requests for the authenticated user
router.get("/user", getUserRequests);

// Get travel requests visible to the authenticated agency (by location)
router.get("/location", getRequestsByLocation);

// Update an existing travel request
router.put("/:id", validateRequest, updateRequest); // Added validateRequest if needed

// Update request status only
router.put("/:id/status", updateRequestStatus);

// Delete an existing travel request
router.delete("/:id", deleteRequest);

module.exports = { requestRouter: router };
