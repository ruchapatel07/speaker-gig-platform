const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, default: "" },
    industry: { type: String, default: "Technology" },
    experience: { type: String, default: "" },
    languages: { type: String, default: "" },
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);