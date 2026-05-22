const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  email: { type: String, required: true, lowercase: true, trim: true, unique: true },

  planStatus: {type: String, required: true},

  planCategory: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Plans", plansSchema);
