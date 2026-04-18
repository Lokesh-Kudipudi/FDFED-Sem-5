const { Booking } = require("../Booking/bookingModel");
const { Hotel } = require("../Accommodation/hotelModel");
const { Tour } = require("../Tour/tourModel");
const mongoose = require("mongoose");

// Get commission report for all hotels
async function getHotelCommissionReport(req, res) {
    try {
        const report = await Booking.aggregate([
            { $match: { type: "Hotel" } },
            {
                $addFields: {
                    cleanCommission: {
                        $convert: {
                            input: "$commissionAmount",
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    },
                    normItemId: { $toObjectId: "$itemId" }
                }
            },
            {
                $group: {
                    _id: "$normItemId",
                    totalCommission: { $sum: "$cleanCommission" },
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
                    _id: 1,
                    hotelInfo: {
                        title: "$hotelDetails.title"
                    },
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
                $addFields: {
                    cleanCommission: {
                        $convert: {
                            input: "$commissionAmount",
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    },
                    normItemId: { $toObjectId: "$itemId" }
                }
            },
            {
                $group: {
                    _id: "$normItemId",
                    totalCommission: { $sum: "$cleanCommission" },
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
                    _id: 1,
                    tourInfo: {
                        title: "$tourDetails.title"
                    },
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
