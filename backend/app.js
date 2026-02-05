const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const toursRouter = require("./routes/toursRouter");
const hotelsRouter = require("./routes/hotelsRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const { authenticateUser } = require("./middleware/authentication");
const { userRouter } = require("./routes/userRouter");
const { autoSignIn } = require("./middleware/autoSignIn");
const { createContactForm } = require("./Controller/ContactController");
const { createStream } = require("rotating-file-stream");
const { User } = require("./Model/userModel");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Adjust as needed
    credentials: true,
  }),
);

app.use(helmet());

// Cookie Parser
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming JSON requests
app.use(express.json());

// Ensure log directory exists
const logDirectory = path.join(__dirname, "log");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create rotating write stream
const accessLogStream = createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
  maxFiles: 10, // keep 10 rotated files
  compress: "gzip", // compress rotated files
});

// Error handling for the stream
accessLogStream.on("error", (err) => {
  console.error("Log stream error:", err);
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(autoSignIn);

// Define the root route
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/autologin", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch fresh user data from database
    const user = await User.findById(decoded._id || decoded.id).select(
      "-passwordHash",
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

// Define the route for the contact page
app
  .route("/contact")
  .get((req, res) => {
    res.sendFile("/html/contact.html", { root: "public" });
  })
  .post(async (req, res) => {
    const { name, email, phone, reason, query } = req.body;

    await createContactForm({
      name,
      email,
      phone,
      reason,
      query,
      userId: req.user ? req.user._id : undefined,
    });

    res.json({
      message: "Contact form submitted successfully",
      data: { name, email, phone, reason, query },
    });
  });

app.use("/", userRouter);

// Use the tours router for routes starting with "/tours"
app.use("/tours", toursRouter);

// Use the hotels router for routes starting with "/hotels"
app.use("/hotels", hotelsRouter);

// Use the dashboard router for routes with "dashboard"
app.use("/dashboard", authenticateUser, dashboardRouter);

const reviewRouter = require("./routes/reviewRouter");
app.use("/reviews", reviewRouter);

const adminUserRouter = require("./routes/adminUserRouter");
app.use("/admin/users", adminUserRouter);

const adminBookingRouter = require("./routes/adminBookingRouter");
app.use("/admin/bookings", adminBookingRouter);

const favouriteRouter = require("./routes/favouriteRouter");
const customTourRouter = require("./routes/customTourRouter");
const tourGuideCustomRouter = require("./routes/tourGuideCustomRouter");
const adminCustomTourRouter = require("./routes/adminCustomTourRouter");
app.use("/api/favourites", favouriteRouter);
app.use("/api/custom-tours", customTourRouter);
app.use("/api/tour-guide/custom-tours", tourGuideCustomRouter);
app.use("/api/admin/custom-tours", adminCustomTourRouter);

async function connectMongoose() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

connectMongoose();

app.listen(process.env.PORT || 5500, () => {
  console.log("Server is running on port 5500");
});
