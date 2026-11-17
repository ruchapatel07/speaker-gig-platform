const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "speaker gig",
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      location VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      full_name VARCHAR(100) DEFAULT '',
      industry VARCHAR(100) DEFAULT 'Technology',
      experience VARCHAR(100) DEFAULT '',
      languages VARCHAR(200) DEFAULT '',
      bio TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

module.exports = { pool, initDb };