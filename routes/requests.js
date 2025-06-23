const express = require("express");
const {
  createRequest,
  getUserRequests,
  getRequestsByLocation,
} = require("../controllers/RequestController");
const { validateRequest } = require("../middlewares/validate");

const router = express.Router();

router.post("/", validateRequest, createRequest);
router.get("/user", getUserRequests);
router.get("/location", getRequestsByLocation);

module.exports = { requestRouter: router };
