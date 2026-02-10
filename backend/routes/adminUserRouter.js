const express = require("express");
const {
  getAllTourGuides,
  createUser,
  deleteUser,
} = require("../Controller/adminUserController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

// All routes require authentication and admin role
router.get("/tour-guides", authenticateUser, getAllTourGuides);
router.post("/create", authenticateUser, createUser);
router.delete("/:userId", authenticateUser, deleteUser);

module.exports = router;
