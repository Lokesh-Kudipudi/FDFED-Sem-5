const { User } = require("../Model/userModel");

// Get all tour guides
async function getAllTourGuides(req, res) {
  try {
    const tourGuides = await User.find({ role: "tourGuide" })
      .select("-password")
      .lean();

    return res.status(200).json({
      status: "success",
      data: tourGuides,
    });
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Get all hotel managers
async function getAllHotelManagers(req, res) {
  try {
    const hotelManagers = await User.find({ role: "hotelManager" })
      .select("-password")
      .lean();

    return res.status(200).json({
      status: "success",
      data: hotelManagers,
    });
  } catch (error) {
    console.error("Error fetching hotel managers:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Create new user (tour guide or hotel manager)
async function createUser(req, res) {
  try {
    const { fullName, email, password, role, phone, address } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: fullName, email, password, role",
      });
    }

    // Validate role
    if (!["tourGuide", "hotelManager"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid role. Must be 'tourGuide' or 'hotelManager'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password, // Will be hashed by the User model pre-save hook
      role,
      phone: phone || "",
      address: address || "",
    });

    await newUser.save();

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      status: "success",
      data: userResponse,
      message: `${role === 'tourGuide' ? 'Tour guide' : 'Hotel manager'} created successfully`,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Update user role
async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["tourGuide", "hotelManager", "user"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  getAllTourGuides,
  getAllHotelManagers,
  createUser,
  updateUserRole,
  deleteUser,
};
