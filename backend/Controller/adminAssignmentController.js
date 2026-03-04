const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");
const { User } = require("../Model/userModel");

// Assign a hotel to an employee
async function assignHotelToEmployee(req, res) {
    try {
        const { hotelId } = req.params;
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ status: "error", message: "Employee ID is required" });
        }

        // Verify employee exists and has the correct role
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== "employee") {
            return res.status(400).json({ status: "error", message: "Invalid Employee ID or user is not an employee" });
        }

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { assignedEmployeeId: employeeId },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ status: "error", message: "Hotel not found" });
        }

        res.status(200).json({ status: "success", data: hotel });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

// Assign a tour to an employee
async function assignTourToEmployee(req, res) {
    try {
        const { tourId } = req.params;
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ status: "error", message: "Employee ID is required" });
        }

        // Verify employee exists and has the correct role
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== "employee") {
            return res.status(400).json({ status: "error", message: "Invalid Employee ID or user is not an employee" });
        }

        const tour = await Tour.findByIdAndUpdate(
            tourId,
            { assignedEmployeeId: employeeId },
            { new: true }
        );

        if (!tour) {
            return res.status(404).json({ status: "error", message: "Tour not found" });
        }

        res.status(200).json({ status: "success", data: tour });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = {
    assignHotelToEmployee,
    assignTourToEmployee,
};
