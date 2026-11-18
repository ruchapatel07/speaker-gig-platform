require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Profile = require("./models/Profile");
const Gig = require("./models/Gig");

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins for CORS
const allowedOrigins = [
  "https://speaker-gig-platform.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, "")] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/speaker-gig-platform.*\.onrender\.com$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Basic server test & health endpoints
app.get("/", (req, res) => {
  res.json({ message: "SpeakHub backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SpeakHub backend is running and healthy!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    databaseName: mongoose.connection.name || "unknown",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SpeakHub backend is running and healthy!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    databaseName: mongoose.connection.name || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password, location } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      location,
    });

    await Profile.create({
      user: user._id,
      fullName: user.fullName,
    });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment.");
      return res.status(500).json({
        message: "Server authentication is not configured.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Unable to register user.",
    });
  }
});

// Log in an existing user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email. Please check your email or click Create Account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again or click Forgot Password to reset it.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment.");
      return res.status(500).json({
        message: "Server authentication is not configured.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

// Reset password for a user
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address.",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Password reset error:", error.message);

    res.status(500).json({
      message: "Unable to reset password.",
    });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required.",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

// Get the logged-in user's profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found.",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      message: "Unable to fetch profile.",
    });
  }
});

// Update the logged-in user's profile
app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "industry",
      "experience",
      "languages",
      "bio",
      "photoUrl",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found.",
      });
    }

    res.json({
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Profile update error:", error.message);

    res.status(500).json({
      message: "Unable to update profile.",
    });
  }
});

// GET /api/gigs — list all open gigs with optional category & search filter
app.get("/api/gigs", async (req, res) => {
  try {
    const { category, q, limit } = req.query;
    const filter = { status: "open" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const gigs = await Gig.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 50);

    res.json({ gigs });
  } catch (error) {
    console.error("Gigs fetch error:", error.message);
    res.status(500).json({ message: "Unable to fetch gigs." });
  }
});

// GET /api/gigs/:id — get single gig details
app.get("/api/gigs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gig ID format." });
    }

    const gig = await Gig.findById(id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found." });
    }

    res.json({ gig });
  } catch (error) {
    console.error("Gig fetch error:", error.message);
    res.status(500).json({ message: "Unable to fetch gig details." });
  }
});

// POST /api/gigs — create a new gig (authenticated)
app.post("/api/gigs", authenticateToken, async (req, res) => {
  try {
    const { title, description, location, date, category, honorarium, image, organizer } = req.body;

    if (!title || !description || !location || !date || !category) {
      return res.status(400).json({
        message: "Title, description, location, date, and category are required.",
      });
    }

    const gig = await Gig.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      date: date.trim(),
      category: category.trim(),
      honorarium: honorarium?.trim() || "Voluntary",
      image: image?.trim() || "",
      organizer: organizer?.trim() || "SpeakHub",
      status: "open",
    });

    res.status(201).json({
      message: "Gig created successfully.",
      gig,
    });
  } catch (error) {
    console.error("Gig creation error:", error.message);
    res.status(500).json({ message: "Unable to create gig." });
  }
});

// PUT /api/gigs/:id — update a gig (authenticated)
app.put("/api/gigs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gig ID format." });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "date",
      "category",
      "honorarium",
      "image",
      "organizer",
      "status",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const gig = await Gig.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found." });
    }

    res.json({
      message: "Gig updated successfully.",
      gig,
    });
  } catch (error) {
    console.error("Gig update error:", error.message);
    res.status(500).json({ message: "Unable to update gig." });
  }
});

// DELETE /api/gigs/:id — delete a gig (authenticated)
app.delete("/api/gigs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gig ID format." });
    }

    const gig = await Gig.findByIdAndDelete(id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found." });
    }

    res.json({
      message: "Gig deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("Gig delete error:", error.message);
    res.status(500).json({ message: "Unable to delete gig." });
  }
});

// GET /api/stats — dashboard stats (counts from DB)
app.get("/api/stats", authenticateToken, async (req, res) => {
  try {
    const totalGigs = await Gig.countDocuments({ status: "open" });
    res.json({
      applications: 12,
      accepted: 4,
      invitations: 2,
      applicationsLeft: 3,
      totalGigs,
    });
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ message: "Unable to fetch stats." });
  }
});

// Seed gigs into DB if the collection is empty
async function seedGigs() {
  const count = await Gig.countDocuments();
  if (count > 0) return;

  const gigs = [
    {
      title: "AI Leadership Summit 2026",
      description:
        "Keynote speaking opportunity on frontier AI systems, developer ecosystems, and enterprise automation. Looking for recognized engineering and product leaders to present on frontier AI models and LLM agent architectures.",
      location: "Bangalore, India",
      date: "20 Oct 2026",
      category: "Technology",
      honorarium: "₹50,000 + Travel",
      match: 92,
      image:
        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      organizer: "TechIndia Events",
      status: "open",
    },
    {
      title: "Future of Work Conference",
      description:
        "Panel discussion on remote collaboration, AI tools, and culture for modern high-performance teams. Seeking speakers on hybrid workplace management, employee burnout prevention, and modern organizational leadership.",
      location: "Mumbai, India",
      date: "15 Nov 2026",
      category: "Leadership",
      honorarium: "₹35,000",
      match: 87,
      image:
        "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=80",
      organizer: "WorkFuture Foundation",
      status: "open",
    },
    {
      title: "Global Innovation Forum",
      description:
        "Fireside chat discussing breakthrough tech trends, venture capital, and scaling global technology startups. Cross-disciplinary gathering of VCs, startup founders, and innovators.",
      location: "Delhi, India",
      date: "05 Dec 2026",
      category: "Innovation",
      honorarium: "Travel & Stay",
      match: 81,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
      organizer: "Global Ventures Alliance",
      status: "open",
    },
    {
      title: "Digital Marketing Expo",
      description:
        "Masterclasses on growth marketing, conversion rate optimization, and AI-driven creative workflows for leading brands and agencies.",
      location: "Pune, India",
      date: "12 Jan 2027",
      category: "Marketing",
      honorarium: "₹40,000",
      match: 76,
      image:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8f5fce0?w=600&q=80",
      organizer: "MarketEdge India",
      status: "open",
    },
    {
      title: "Startup Founders Meet",
      description:
        "Intimate networking and panels for seed and Series A founders discussing product-market fit and bootstrapping. Exclusive invite-only for early-stage entrepreneurs.",
      location: "Hyderabad, India",
      date: "22 Feb 2027",
      category: "Business",
      honorarium: "Honorary Keynote",
      match: 71,
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
      organizer: "Founders Club India",
      status: "open",
    },
    {
      title: "Women in Tech Summit",
      description:
        "Celebrating diversity and excellence in tech with focus on cloud architecture, cybersecurity, and data science careers. Building a more inclusive technology industry.",
      location: "Chennai, India",
      date: "08 Mar 2027",
      category: "Technology",
      honorarium: "₹45,000 + Travel",
      match: 68,
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d1?w=600&q=80",
      organizer: "WomenTech Network India",
      status: "open",
    },
    {
      title: "EdTech Innovation Conference",
      description:
        "Revolutionizing education through technology — AI tutors, adaptive learning, and immersive VR classrooms. Looking for visionary educators and technologists.",
      location: "Kolkata, India",
      date: "18 Apr 2027",
      category: "Education",
      honorarium: "₹30,000",
      match: 65,
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
      organizer: "EduFuture India",
      status: "open",
    },
    {
      title: "Healthcare & AI Symposium",
      description:
        "Bringing together doctors, data scientists, and healthcare executives to discuss AI in diagnostics, drug discovery, and patient care innovation.",
      location: "Ahmedabad, India",
      date: "02 May 2027",
      category: "Health",
      honorarium: "₹55,000 + Travel",
      match: 60,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
      organizer: "MedTech India",
      status: "open",
    },
  ];

  await Gig.insertMany(gigs);
  console.log(`Seeded ${gigs.length} gigs into the database.`);
}

// Start only after MongoDB connects
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the backend .env file.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from the backend .env file.");
    }

    const dbName = process.env.MONGODB_DB_NAME || "speakhub";
    await mongoose.connect(process.env.MONGODB_URI, { dbName });

    console.log(`MongoDB connected successfully to database: ${mongoose.connection.name}`);

    await seedGigs();

    app.listen(PORT, () => {
      console.log(`SpeakHub backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
