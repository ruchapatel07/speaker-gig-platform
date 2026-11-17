// Script to fix broken gig image URLs in MongoDB
require("dotenv").config();
const mongoose = require("mongoose");
const Gig = require("./models/Gig");

const IMAGE_FIXES = [
  {
    title: "AI Leadership Summit 2026",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
  },
  {
    title: "Future of Work Conference",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  },
  {
    title: "Global Innovation Forum",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  },
  {
    title: "Digital Marketing Expo",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    title: "Startup Founders Meet",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
  },
  {
    title: "Women in Tech Summit",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  },
  {
    title: "EdTech Innovation Conference",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  },
  {
    title: "Healthcare & AI Symposium",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=600&q=80",
  },
];

async function fixImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  for (const fix of IMAGE_FIXES) {
    const result = await Gig.updateOne(
      { title: fix.title },
      { $set: { image: fix.image } }
    );
    console.log(`${fix.title}: ${result.modifiedCount ? "✅ updated" : "⚠️  not found"}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

fixImages().catch(console.error);

