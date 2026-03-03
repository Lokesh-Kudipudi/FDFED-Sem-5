const { Booking } = require("../Model/bookingModel");
const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");
const mongoose = require("mongoose");

// Get commission report for all hotels
async function getHotelCommissionReport(req, res) {
    try {
        const report = await Booking.aggregate([
            { $match: { type: "Hotel" } },
            {
                $group: {
                    _id: "$itemId",
                    totalCommission: { $sum: "$commissionAmount" },
                    bookingCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: "_id",
                    foreignField: "_id",
                    as: "hotelDetails",
                },
            },
            { $unwind: "$hotelDetails" },
            {
                $project: {
                    hotelId: "$_id",
                    hotelTitle: "$hotelDetails.title",
                    totalCommission: 1,
                    bookingCount: 1,
                },
            },
        ]);

        res.status(200).json({ status: "success", data: report });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

// Get commission report for all tours
async function getTourCommissionReport(req, res) {
    try {
        const report = await Booking.aggregate([
            { $match: { type: "Tour" } },
            {
                $group: {
                    _id: "$itemId",
                    totalCommission: { $sum: "$commissionAmount" },
                    bookingCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "tours",
                    localField: "_id",
                    foreignField: "_id",
                    as: "tourDetails",
                },
            },
            { $unwind: "$tourDetails" },
            {
                $project: {
                    tourId: "$_id",
                    tourTitle: "$tourDetails.title",
                    totalCommission: 1,
                    bookingCount: 1,
                },
            },
        ]);

        res.status(200).json({ status: "success", data: report });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = {
    getHotelCommissionReport,
    getTourCommissionReport,
};
