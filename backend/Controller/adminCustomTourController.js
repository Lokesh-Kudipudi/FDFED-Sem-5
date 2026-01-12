const CustomTourRequest = require("../Model/CustomTourRequest");

// @desc    Get all custom tour requests for admin
// @route   GET /api/admin/custom-tours
// @access  Private (Admin only)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await CustomTourRequest.find()
      .populate("userId", "fullName email")
      .populate("assignedTourGuide", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// @desc    Assign tour guide to request
// @route   POST /api/admin/custom-tours/:id/assign
// @access  Private (Admin only)
exports.assignTourGuide = async (req, res) => {
  try {
    const { tourGuideId } = req.body;

    const request = await CustomTourRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "Request not found",
      });
    }

    request.assignedTourGuide = tourGuideId;
    request.status = "assigned";
    await request.save();

    res.status(200).json({
      status: "success",
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// @desc    Update request status
// @route   PATCH /api/admin/custom-tours/:id/status
// @access  Private (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await CustomTourRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "Request not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
