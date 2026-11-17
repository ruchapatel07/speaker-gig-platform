const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    event: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Accepted", "Rejected"],
      default: "Applied",
    },
    appliedOn: { type: String, required: true },
    topic: { type: String, default: "" },
    pitch: { type: String, default: "" },
    reviewerFeedback: { type: String, default: "Your application is being processed." },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
