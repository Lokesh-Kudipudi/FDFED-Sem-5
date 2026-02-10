const jwt = require("jsonwebtoken");

function autoSignIn(req, res, next) {
  if (req.user) {
    return next();
  }
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return next();
  }
}

module.exports = { autoSignIn };
