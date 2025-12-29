const cloudinary = require('cloudinary').v2;

console.log("DEBUG: Config cloudinary.js loading");
console.log("DEBUG: CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("DEBUG: CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
