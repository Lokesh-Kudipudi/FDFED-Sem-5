const express = require("express");
const { updateUser } = require("../Controller/userController");
const { getAllTourGuides } = require("../Controller/adminUserController");
const upload = require("../middleware/upload");
const { User } = require("../Model/userModel");
const { authenticateUser } = require("../middleware/authentication");

const usersRouter = express.Router();

// Get all tour guides
usersRouter.get("/tour-guides", getAllTourGuides);

// Update user profile
usersRouter.post("/profile", authenticateUser, (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2));
      return res.status(500).json({
        status: "fail",
        message: "Image upload failed",
        error: err.message || err,
      });
    }
    next();
  });
}, updateUser);

// Upload user photo
usersRouter.post("/photo", authenticateUser, (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2));
      return res.status(500).json({
        status: "fail",
        message: "Image upload failed",
        error: err.message || err,
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No file uploaded",
      });
    }

    const photoUrl = req.file.path;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo: photoUrl },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Photo uploaded successfully",
      photoUrl: photoUrl,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = usersRouter;
