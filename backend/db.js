import Database from 'better-sqlite3';
import dotenv from 'dotenv';
dotenv.config();

// Initialize SQLite database
const dbPath = process.env.DB_PATH || './reconnect.db';
const db = new Database(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create tables if they don't exist
try {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'alumni')) NOT NULL
    )
  `);

  // Student profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_profile (
      student_id INTEGER PRIMARY KEY,
      skills TEXT NOT NULL,
      interests TEXT NOT NULL,
      linkedin_url TEXT,
      coding_url TEXT,
      resume_url TEXT,
      FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Alumni profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alumni_profile (
      alumni_id INTEGER PRIMARY KEY,
      domain TEXT NOT NULL,
      company TEXT NOT NULL,
      expertise TEXT NOT NULL,
      linkedin_url TEXT,
      coding_url TEXT,
      resume_url TEXT,
      FOREIGN KEY (alumni_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Availability table
  db.exec(`
    CREATE TABLE IF NOT EXISTS availability (
      availability_id INTEGER PRIMARY KEY AUTOINCREMENT,
      alumni_id INTEGER,
      date TEXT,
      start_time TEXT,
      end_time TEXT,
      is_booked BOOLEAN DEFAULT 0,
      FOREIGN KEY (alumni_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      alumni_id INTEGER,
      availability_id INTEGER,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      date TEXT,
      start_time TEXT,
      end_time TEXT,
      meet_link TEXT,
      FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (alumni_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (availability_id) REFERENCES availability(availability_id) ON DELETE CASCADE
    )
  `);

  // Notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Metrics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS metrics (
      metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      value REAL,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database connected and tables created successfully');
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
}

export default db;
