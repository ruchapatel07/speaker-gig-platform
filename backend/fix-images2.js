require("dotenv").config();
const mongoose = require("mongoose");
const Gig = require("./models/Gig");

// Only fix the remaining broken ones
const FIXES = [
  {
    title: "Healthcare & AI Symposium",
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80",
  },
  {
    title: "EdTech Innovation Conference",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
  },
  {
    title: "Digital Marketing Expo",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80",
  },
  {
    title: "Women in Tech Summit",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  },
];

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const f of FIXES) {
    const r = await Gig.updateOne({ title: f.title }, { $set: { image: f.image } });
    console.log(`${f.title}: ${r.modifiedCount ? "✅" : "⚠️ not found"}`);
  }
  await mongoose.disconnect();
  console.log("Done.");
}

fix().catch(console.error);

