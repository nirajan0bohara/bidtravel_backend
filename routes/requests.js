const express = require("express");
const {
  createRequest,
  getUserRequests,
  getRequestsByLocation,
  updateRequest,
  deleteRequest,
  getRequestById,
} = require("../controllers/RequestController");
const { validateRequest } = require("../middlewares/validate");
const { authMiddleware } = require("../middlewares/auth"); // Corrected import

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new travel request (POST /api/requests)
router.post("/", validateRequest, createRequest);

// Get all travel requests for the authenticated user (GET /api/requests/user)
router.get("/user", getUserRequests);

// Get travel requests visible to the authenticated agency by location (GET /api/requests/location)
router.get("/location", getRequestsByLocation);

// Get a specific travel request by ID (GET /api/requests/:id)
router.get("/:id", getRequestById);

// Update an existing travel request (PUT /api/requests/:id)
router.put("/:id", validateRequest, updateRequest);

// Delete an existing travel request (DELETE /api/requests/:id)
router.delete("/:id", deleteRequest);

module.exports = { requestRouter: router };
