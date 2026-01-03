const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const toursRouter = require("./routes/toursRouter");
const hotelsRouter = require("./routes/hotelsRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  authenticateUser,
  authenticateRole,
} = require("./middleware/authentication");
const { userRouter } = require("./routes/userRouter");
const { autoSignIn } = require("./middleware/autoSignIn");
const {
  createContactForm,
} = require("./Controller/ContactController");

const cors = require("cors");

// Set EJS as the templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Adjust as needed
    credentials: true,
  })
);

// Cookie Parser
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming JSON requests
app.use(express.json());
app.use(morgan("dev"));

app.use(autoSignIn);

// Define the root route
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/autologin", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: decoded });
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
