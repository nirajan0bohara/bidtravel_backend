const express = require("express");
const {
  createRequest,
  getUserRequests,
  getRequestsByLocation,
  updateRequest,
  deleteRequest,
} = require("../controllers/RequestController");
const { validateRequest } = require("../middlewares/validate");

const router = express.Router();

// Create a new travel request
router.post("/", validateRequest, createRequest);

// Get all travel requests for the authenticated user
router.get("/user", getUserRequests);

// Get travel requests visible to the authenticated agency (by location)
router.get("/location", getRequestsByLocation);

// Update an existing travel request
router.put("/:id", validateRequest, updateRequest); // Added validateRequest if needed

// Delete an existing travel request
router.delete("/:id", deleteRequest);

module.exports = { requestRouter: router };