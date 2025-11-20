const mongoose = require("mongoose");

const ContactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
  },
  query: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactForm = mongoose.model(
  "ContactForm",
  ContactFormSchema
);

module.exports = { ContactForm };