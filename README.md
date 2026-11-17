# SpeakerGig – AI-Based Speaker Gig Discovery Platform

**SpeakerGig** (SpeakHub) is a comprehensive platform engineered to connect professional speakers, domain experts, and keynote presenters with event organizers, conferences, and leadership summits. By providing smart category matching, tailored gig recommendations, application tracking, and profile management, SpeakerGig streamlines the process of discovering and securing high-impact speaking engagements.

---

## 🎯 Project Objectives

- **Simplify Gig Discovery:** Provide an intuitive catalog of speaking opportunities filtered by domain, location, date, and honorarium.
- **Smart Speaker Matching:** Calculate and display match scores between speaker profiles and event requirements to maximize application success rates.
- **Application Lifecycle Tracking:** Enable speakers to manage proposals across statuses (`Applied`, `Under Review`, `Accepted`, `Rejected`) with feedback insights.
- **Unified Speaker Hub:** Centralize profile credentials, industry domains, bios, portfolios, and engagement analytics in one cohesive dashboard.
- **Flexible Subscription Tiers:** Provide application quota management and tiered subscription packages tailored for emerging to enterprise speakers.

---

## 🚀 Key Features

- **Personalized Speaker Dashboard:** Real-time visibility into active applications, acceptance rates, incoming invitations, and remaining application credits.
- **Discover Speaking Gigs:** Searchable catalog with keyword search, category filtering (Technology, Leadership, Innovation, Marketing, Business, Health, Education), honorarium details, and match indicators.
- **Speaker Profile Management:** Complete profile configuration with customizable bio, industry specialization, years of experience, spoken languages, and avatar photos.
- **Application & Proposal Management:** End-to-end tracking of event applications including pitch submission, topic focus, submission dates, and organizer review status.
- **Notifications Hub:** Dedicated notification feed for application status updates, event organizer invitations, and system notifications.
- **Subscription Management:** Interactive subscription upgrade and renewal module supporting Basic, Professional, and Enterprise plans with real-time quota tracking.
- **Secure Authentication & Session Management:** Token-based JWT authentication with bcrypt password encryption, protected routes, and persistent session state.

---

## 🛠️ Technologies Used

### Frontend
- **React 19** (`react`, `react-dom`) – Modern component architecture with hooks and context state management.
- **Vite 8** – Fast build tooling and Hot Module Replacement (HMR).
- **React Router** (`react-router-dom`) – Client-side routing and page management.
- **Lucide React** – Clean, modern UI iconography.
- **Oxlint** – High-performance JavaScript/JSX linting.
- **Custom CSS** – Responsive styling with flexbox/grid layout and polished UI design.

### Backend
- **Node.js** & **Express 5** (`express`) – High-performance RESTful API microservice.
- **MongoDB & Mongoose 8** (`mongoose`) – Document database schema validation, relational refs, and automatic indexing.
- **JSON Web Tokens (JWT)** (`jsonwebtoken`) – Stateless API authentication and protected route middleware.
- **bcryptjs** – Secure salted password hashing.
- **CORS** (`cors`) – Cross-Origin Resource Sharing middleware.
- **dotenv** – Secure environment variable configuration.
- **Nodemon** – Development live-reload utility.
- **PostgreSQL / pg** (`pg`) – Optional relational database adapter and table migration support (`db.js`).

---

## 📂 Project Folder Structure

```
speaker-gig-platform/
├── backend/
│   ├── models/
│   │   ├── Application.js       # Speaker application schema & status tracking
│   │   ├── Gig.js               # Event gig schema, categories, honorarium & match
│   │   ├── Notification.js      # User alerts for applications & invitations
│   │   ├── Profile.js           # Speaker portfolio and profile details schema
│   │   └── User.js              # User auth credentials & password hash hooks
│   ├── .env.example             # Backend environment template
│   ├── db.js                    # PostgreSQL pool & table initializer
│   ├── fix-images.js            # MongoDB image URL curation utility
│   ├── fix-images2.js           # Supplementary asset repair script
│   ├── package.json             # Backend dependencies & run scripts
│   ├── package-lock.json        # Locked dependency tree
│   └── server.js                # Express API server entrypoint & seed logic
├── frontend/
│   └── speaker-gig-platform/
│       ├── public/              # Static public assets (favicons, icons)
│       ├── src/
│       │   ├── api/
│       │   │   └── api.js       # Centralized REST client for backend endpoints
│       │   ├── assets/          # Project visual assets & illustrations
│       │   ├── components/      # Reusable UI widgets (Navbar, Sidebar, Hero, Stats)
│       │   ├── context/         # AuthContext provider & authentication state
│       │   ├── pages/           # Application views (Dashboard, Discover, Profile, etc.)
│       │   ├── App.css          # Main layout and view stylesheet
│       │   ├── App.jsx          # Route orchestration & protected view guards
│       │   ├── HookTest.jsx     # Development sanity check component
│       │   ├── index.css        # Base styling and design tokens
│       │   └── main.jsx         # React application root with ErrorBoundary
│       ├── .gitignore           # Frontend-specific git exclusions
│       ├── .oxlintrc.json       # Oxlint linter rules
│       ├── index.html           # Single Page Application HTML entrypoint
│       ├── package.json         # Frontend dependencies & Vite scripts
│       ├── package-lock.json    # Locked dependency tree
│       └── vite.config.js       # Vite bundler configuration
├── .gitignore                   # Comprehensive repository gitignore
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variable Setup

### Backend Environment Variables
Create a `.env` file inside the `backend/` directory based on `backend/.env.example`:

```bash
# In backend/.env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/speakhub
JWT_SECRET=your_secure_jwt_secret_key_here

# Optional: PostgreSQL Database Settings (if using pg)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=speaker_gig
```

> **Security Note:** Never commit `.env` or sensitive credentials to version control. The repository `.gitignore` automatically excludes all environment files.

---

## 💻 Installation & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
- Git

---

### 1. Backend Setup & Execution

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure MongoDB is running on your machine:
   ```bash
   # Example for local MongoDB daemon
   mongod
   ```

4. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

5. Start the backend server:
   ```bash
   # Development mode with automatic reload:
   npm run dev

   # Or standard production start:
   npm start
   ```

The backend API will start at `http://localhost:5000`. On first run, it will automatically connect to MongoDB and seed initial curated speaking gigs.

---

### 2. Frontend Setup & Execution

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend/speaker-gig-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and access the application at `http://localhost:5173` (or the URL displayed in your terminal).

---

## 🗄️ Database Configuration

### MongoDB (Default)
The primary backend data store is MongoDB, managed via Mongoose models:
- **Automatic Seeding:** The server checks if the `gigs` collection has records upon startup; if empty, it populates initial events across diverse industries.
- **Connection URI:** Configurable via `MONGODB_URI` in `backend/.env`.

### PostgreSQL (Optional)
The project includes a PostgreSQL migration and connection pool helper in `backend/db.js` providing relational table schemas for `users` and `profiles` should a relational SQL architecture be desired.

---

## 🌐 Data Pipelines & Scraper Notes

The platform currently operates on a curated seed repository of speaking engagements with full support for search and category filtering. Future automated event ingestion can be plugged directly into the MongoDB `Gig` model via external scraping microservices or event API webhooks.

---

## 👥 Contributors

- **Rucha Patel** ([@ruchapatel07](https://github.com/ruchapatel07)) – Platform Architecture, Full-Stack Development & UI Design

---

## 📄 License

This project is licensed under the ISC License.
