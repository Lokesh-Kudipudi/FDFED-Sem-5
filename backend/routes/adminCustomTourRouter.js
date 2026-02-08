const express = require("express");
const router = express.Router();
const { getAllRequests, assignTourGuide } = require("../Controller/adminCustomTourController");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");

// All routes require authentication and admin role
router.use(authenticateUser);
router.use(authenticateRole(["admin"]));

// @route   GET /api/admin/custom-tours
router.get("/", getAllRequests);

// @route   POST /api/admin/custom-tours/:id/assign
router.post("/:id/assign", assignTourGuide);

module.exports = router;
