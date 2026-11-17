const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    category: {
      type: String,
      enum: ["Technology", "Leadership", "Innovation", "Marketing", "Business", "Health", "Education"],
      required: true,
    },
    honorarium: { type: String, default: "Voluntary" },
    match: { type: Number, default: 75 },
    image: { type: String, default: "" },
    organizer: { type: String, default: "SpeakHub" },
    status: { type: String, enum: ["open", "closed", "upcoming"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);

