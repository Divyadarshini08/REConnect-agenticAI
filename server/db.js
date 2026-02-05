// db.js - Database module using sql.js
import initSqlJs from 'sql.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Global variables to hold the database and SQL module
let db = null;
let SQL = null;

// Initialize SQLite database with sql.js
async function initializeDatabase() {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();

    // Check if database file exists
    const dbPath = process.env.DB_PATH || './reconnect.db';
    let data;
    
    if (fs.existsSync(dbPath)) {
      // Load existing database file
      data = fs.readFileSync(dbPath);
      db = new SQL.Database(data);
    } else {
      // Create new database
      db = new SQL.Database();
    }

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;');

    // Create tables if they don't exist
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('student', 'alumni')) NOT NULL
      )
    `);

    // Student profile table
    db.run(`
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
    db.run(`
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
    db.run(`
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
    db.run(`
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
    db.run(`
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
    db.run(`
      CREATE TABLE IF NOT EXISTS metrics (
        metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        value REAL,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database connected and tables created successfully');

    // Set up auto-save to file periodically
    setInterval(() => {
      try {
        const data = db.export();
        const buffer = new Uint8Array(data);
        fs.writeFileSync(process.env.DB_PATH || './reconnect.db', buffer);
      } catch (saveErr) {
        console.error('Error saving database:', saveErr.message);
      }
    }, 30000); // Save every 30 seconds

    return db;
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  }
}

// We'll create a module-level promise that initializes the database
const dbInitPromise = initializeDatabase();

// Create a wrapper object that delays operations until DB is initialized
const dbWrapper = {
  async prepare(sql) {
    const database = await dbInitPromise;
    const stmt = database.prepare(sql);
    return {
      get: (...params) => stmt.getAsObject(...params),
      all: (...params) => stmt.all(...params),
      run: (...params) => stmt.run(...params)
    };
  },

  async exec(sql) {
    const database = await dbInitPromise;
    return database.run(sql);
  },

  async run(sql, ...params) {
    const database = await dbInitPromise;
    return database.run(sql, ...params);
  }
};

export default dbWrapper;