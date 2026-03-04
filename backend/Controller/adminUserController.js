const { User } = require("../Model/userModel");
const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");
const { Booking } = require("../Model/bookingModel");
const bcrypt = require("bcryptjs");

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

// Get all employees
async function getAllEmployees(req, res) {
  try {
    const employees = await User.find({ role: "employee" })
      .select("-passwordHash")
      .lean();

    const employeesWithAssignments = await Promise.all(
      employees.map(async (emp) => {
        // Find all assigned hotels
        const hotels = await Hotel.find({ assignedEmployeeId: emp._id }).select("title _id").lean();

        // Find all assigned tours
        const tours = await Tour.find({ assignedEmployeeId: emp._id }).select("title _id").lean();

        const assignments = [];
        let totalHotelRevenue = 0;
        let totalTourRevenue = 0;

        // Helper to robustly parse price strings (strips currency symbols, commas, etc)
        const parsePrice = (priceVal) => {
          if (typeof priceVal === 'number') return priceVal;
          if (!priceVal) return 0;
          const clean = String(priceVal).replace(/[^\d.-]/g, '');
          return parseFloat(clean) || 0;
        };

        // Process Hotel Revenues
        for (const hotel of hotels) {
          const hotelBookings = await Booking.find({
            itemId: { $in: [hotel._id, hotel._id.toString()] },
            type: "Hotel",
            "bookingDetails.status": { $nin: ["cancel", "cancelled", "Cancel", "Cancelled"] }
          }).select("bookingDetails.price").lean();

          const revenue = hotelBookings.reduce((sum, b) => sum + parsePrice(b.bookingDetails?.price), 0);
          totalHotelRevenue += revenue;
          assignments.push({
            id: hotel._id,
            title: hotel.title,
            type: "Hotel",
            revenue
          });
        }

        // Process Tour Revenues
        for (const tour of tours) {
          const tourBookings = await Booking.find({
            itemId: { $in: [tour._id, tour._id.toString()] },
            type: "Tour",
            "bookingDetails.status": { $nin: ["cancel", "cancelled", "Cancel", "Cancelled"] }
          }).select("bookingDetails.price").lean();

          const revenue = tourBookings.reduce((sum, b) => sum + parsePrice(b.bookingDetails?.price), 0);
          totalTourRevenue += revenue;
          assignments.push({
            id: tour._id,
            title: tour.title,
            type: "Tour",
            revenue
          });
        }

        return {
          ...emp,
          assignments,
          totalHotelRevenue,
          totalTourRevenue,
          totalRevenue: totalHotelRevenue + totalTourRevenue,
          assignedTo: assignments.length > 0
            ? assignments.map(a => a.title).join(", ")
            : null
        };
      })
    );

    return res.status(200).json({
      status: "success",
      data: employeesWithAssignments,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
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
    if (!["tourGuide", "hotelManager", "employee"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid role. Must be 'tourGuide', 'hotelManager', or 'employee'",
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      passwordHash,
      role,
      phone: phone || "",
      address: address || "",
    });

    await newUser.save();

    // Return user without sensitive data
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    return res.status(201).json({
      status: "success",
      data: userResponse,
      message: `${role === 'employee' ? 'Employee' : (role === 'tourGuide' ? 'Tour guide' : 'Hotel manager')} created successfully`,
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
    if (!["tourGuide", "hotelManager", "user", "employee"].includes(role)) {
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
  getAllEmployees,
  createUser,
  updateUserRole,
  deleteUser,
};
