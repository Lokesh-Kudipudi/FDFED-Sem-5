const express = require("express");
const {
  getAllTourGuides,
  getAllHotelManagers,
  createUser,
  updateUserRole,
  deleteUser,
} = require("../Controller/adminUserController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

// All routes require authentication and admin role
// Note: You may want to add an admin role check middleware

router.get("/tour-guides", authenticateUser, getAllTourGuides);
router.get("/hotel-managers", authenticateUser, getAllHotelManagers);
router.post("/create", authenticateUser, createUser);
router.put("/:userId/role", authenticateUser, updateUserRole);
router.delete("/:userId", authenticateUser, deleteUser);

module.exports = router;
