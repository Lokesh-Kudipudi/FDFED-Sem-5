async function updatePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.passwordHash = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../Model/userModel");
const { getUserBookings } = require("./bookingController");

// Helper to generate JWT
function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      photo: user.photo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Sign up regular user
async function signUpUser(req, res) {
  const { fullName, email, password, phone, address } = req.body;
  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      phone,
      address,
      passwordHash,
      role: "user",
    });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user; // Attach user to request for further use

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Sign up hotel manager
async function signUphotelManager(req, res) {
  const { fullName, email, password, phone, address } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      address,
      role: "hotelManager",
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user; // Attach user to request for further use

    res.status(201).json({
      status: "success",
      message: "Hotel Manager created successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Sign up tour guide
async function signUpTourGuide(req, res) {
  const { fullName, email, password, phone, address } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      address,
      role: "tourGuide",
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user; // Attach user to request for further use

    res.status(201).json({
      status: "success",
      message: "Tour Guide created successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Sign up admin
async function signUpAdmin(req, res) {
  const { fullName, email, password, phone, address } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      address,
      role: "admin",
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user; // Attach user to request for further use

    res.status(201).json({
      status: "success",
      message: "Admin created successfully",
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// User login
async function fetchUserByEmailPassword(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user; // Attach user to request for further use

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Get all users (admin use)
async function getUsers(req, res) {
  try {
    const users = await User.find().select("-passwordHash");

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Update User

async function updateUser(req, res) {
  const { fullName, email, phone, address } = req.body || {};
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    if (req.file) {
      user.photo = req.file.path;
    }
    await user.save();

    const token = generateToken(user);

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access on client-side
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user;

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Logout (handled client-side in JWT — optional server blacklist etc.)
function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });

  req.user = null;
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
}

async function getBookingAnalytics(userId) {
  try {
    const bookings = await getUserBookings(userId);

    if (bookings.status === "error") {
      return {
        status: "error",
        message: bookings.message,
      };
    }

    const userBookings = Array.isArray(bookings.data) ? bookings.data : [];

    // Separate hotel and tour bookings
    const hotelBookings = userBookings.filter(
      (booking) => booking.type === "Hotel"
    );
    const tourBookings = userBookings.filter(
      (booking) => booking.type === "Tour"
    );

    // Count by status
    const getStatusCounts = (bookingList) => {
      const counts = {
        pending: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        total: bookingList.length,
      };

      bookingList.forEach((booking) => {
        const status = booking.bookingDetails?.status || "pending";
        if (status === "cancel") {
          counts.cancelled++;
        } else {
          counts[status] = (counts[status] || 0) + 1;
        }
      });

      return counts;
    };

    const analytics = {
      total: {
        count: userBookings.length,
        hotels: hotelBookings.length,
        tours: tourBookings.length,
      },
      hotels: getStatusCounts(hotelBookings),
      tours: getStatusCounts(tourBookings),
      recent: userBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    return {
      status: "success",
      data: analytics,
    };
  } catch (error) {
    console.error("Error in getBookingAnalytics:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getBookingAnalyticsController(req, res) {
  try {
    const analytics = await getBookingAnalytics(req.user._id);

    if (analytics.status === "error") {
      console.error("Error fetching booking analytics:", analytics.message);
      return res.render("dashboard/user/bookingAnalytics", {
        user: req.user,
        analytics: null,
        error: "Failed to load booking analytics. Please try again later.",
      });
    }

    res.render("dashboard/user/bookingAnalytics", {
      user: req.user,
      analytics: analytics.data,
    });
  } catch (error) {
    console.error("Unexpected error in getBookingAnalyticsController:", error);
    res.render("dashboard/user/bookingAnalytics", {
      user: req.user,
      analytics: null,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function getHotelBookingsController(req, res) {
  try {
    const bookings = await getUserBookings(req.user._id);

    if (bookings.status === "error") {
      console.error("Error fetching hotel bookings:", bookings.message);
      return res.render("dashboard/user/hotelBookings", {
        user: req.user,
        bookings: [],
        error: "Failed to load hotel bookings. Please try again later.",
      });
    }

    const userBookings = Array.isArray(bookings.data) ? bookings.data : [];
    const hotelBookings = userBookings.filter(
      (booking) => booking.type === "Hotel"
    );

    res.render("dashboard/user/hotelBookings", {
      user: req.user,
      bookings: hotelBookings,
      message:
        hotelBookings.length === 0
          ? "No hotel bookings found. Explore our hotels!"
          : null,
    });
  } catch (error) {
    console.error("Unexpected error in getHotelBookingsController:", error);
    res.render("dashboard/user/hotelBookings", {
      user: req.user,
      bookings: [],
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function getTourBookingsController(req, res) {
  try {
    const bookings = await getUserBookings(req.user._id);

    if (bookings.status === "error") {
      console.error("Error fetching tour bookings:", bookings.message);
      return res.render("dashboard/user/tourBookings", {
        user: req.user,
        bookings: [],
        error: "Failed to load tour bookings. Please try again later.",
      });
    }

    const userBookings = Array.isArray(bookings.data) ? bookings.data : [];
    const tourBookings = userBookings.filter(
      (booking) => booking.type === "Tour"
    );

    res.render("dashboard/user/tourBookings", {
      user: req.user,
      bookings: tourBookings,
      message:
        tourBookings.length === 0
          ? "No tour bookings found. Discover amazing tours!"
          : null,
    });
  } catch (error) {
    console.error("Unexpected error in getTourBookingsController:", error);
    res.render("dashboard/user/tourBookings", {
      user: req.user,
      bookings: [],
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function getUserBookingsController(req, res) {
  // Redirect to analytics page by default
  res.redirect("/dashboard/bookings/analytics");
}

module.exports = {
  signUpUser,
  signUphotelManager,
  signUpTourGuide,
  signUpAdmin,
  getUsers,
  fetchUserByEmailPassword,
  logout,
  updateUser,
  updatePassword,
  getUserBookingsController,
  getBookingAnalyticsController,
  getHotelBookingsController,
  getTourBookingsController,
  getBookingAnalytics,
};
