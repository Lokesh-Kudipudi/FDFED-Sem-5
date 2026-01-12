const CustomTourRequest = require("../Model/CustomTourRequest");

// @desc    Get assigned custom tour requests (for tour guides)
// @route   GET /api/tour-guide/custom-tours
// @access  Private (Tour Guide only)
exports.getAllRequests = async (req, res) => {
  try {
    console.log("Tour Guide requesting custom tours. ID:", req.user._id);
    
    const query = {
      assignedTourGuide: req.user._id,
      status: { $in: ["assigned", "quoted", "bargaining"] },
    };
    console.log("Querying with:", JSON.stringify(query));

    const requests = await CustomTourRequest.find(query)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    console.log("Found requests:", requests.length);

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

// @desc    Get tour guide's submitted quotes
// @route   GET /api/tour-guide/custom-tours/my-quotes
// @access  Private (Tour Guide only)
exports.getMyQuotes = async (req, res) => {
  try {
    const requests = await CustomTourRequest.find({
      "quotes.tourGuideId": req.user._id,
    })
      .populate("userId", "fullName email")
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

// @desc    Submit quote for a custom tour request
// @route   POST /api/tour-guide/custom-tours/:id/quote
// @access  Private (Tour Guide only)
exports.submitQuote = async (req, res) => {
  try {
    const { amount, message, itinerary } = req.body;

    const request = await CustomTourRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "Request not found",
      });
    }

    // Check if tour guide already submitted a quote
    const existingQuote = request.quotes.find(
      (q) => q.tourGuideId.toString() === req.user._id.toString()
    );

    if (existingQuote) {
      return res.status(400).json({
        status: "fail",
        message: "You have already submitted a quote for this request",
      });
    }

    request.quotes.push({
      tourGuideId: req.user._id,
      tourGuideName: req.user.fullName,
      amount,
      message,
      itinerary,
    });

    request.status = "quoted";
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

// @desc    Update quote (respond to bargain)
// @route   PUT /api/tour-guide/custom-tours/:id/quote
// @access  Private (Tour Guide only)
exports.updateQuote = async (req, res) => {
  try {
    const { amount, message } = req.body;

    const request = await CustomTourRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "Request not found",
      });
    }

    const quoteIndex = request.quotes.findIndex(
      (q) => q.tourGuideId.toString() === req.user._id.toString()
    );

    if (quoteIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Quote not found",
      });
    }

    request.quotes[quoteIndex].amount = amount;
    request.quotes[quoteIndex].message = message;
    request.quotes[quoteIndex].createdAt = Date.now();

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
