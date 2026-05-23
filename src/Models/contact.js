const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {type: String, required: true},

  email: {type: String, lowercase: true, required: true},

  subject: {type: String, required: true},

  message: {type: String, required: true}
});

module.exports = mongoose.model("Contact", contactSchema);
