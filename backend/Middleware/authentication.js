const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
}

function authenticateRole(role) {
  return (req, res, next) => {
    if (!req.user || !role.includes(req.user.role)) {
      return res.status(401).json({
        status: "fail",
        message:
          "Access denied. You do not have the required role.",
      }); // Redirect to home if user does not have the required role
    }
    next(); // Continue to the next middleware or route handler
  };
}

module.exports = { authenticateUser, authenticateRole };
