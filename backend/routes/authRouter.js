const express = require("express");
const {
  signUpUser,
  signUphotelManager,
  signUpTourGuide,
  fetchUserByEmailPassword,
  logout,
  updatePassword,
  deleteAccount,
  forgotPassword,
  verifyOTP,
  resetPasswordWithToken,
} = require("../Controller/userController");
const { authenticateUser } = require("../middleware/authentication");
const jwt = require("jsonwebtoken");
const { User } = require("../Model/userModel");

const authRouter = express.Router();

// Public routes
authRouter.post("/login", fetchUserByEmailPassword);
authRouter.post("/register", signUpUser);
authRouter.post("/register/hotel-manager", signUphotelManager);
authRouter.post("/register/tour-guide", signUpTourGuide);
authRouter.get("/logout", logout);

// Get current user (autologin)
authRouter.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id || decoded.id).select(
      "-passwordHash"
    );

    if (!user) {
      return res.json({ user: null });
    }

    return res.json({ user });
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.json({ user: null });
  }
});

// Protected routes
authRouter.post("/password", authenticateUser, updatePassword);
authRouter.delete("/account", authenticateUser, deleteAccount);

// Password reset flow
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPasswordWithToken);

module.exports = authRouter;
