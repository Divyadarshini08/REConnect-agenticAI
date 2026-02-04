import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "reconnect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  connectTimeout: 60000,
  timeout: 60000,
  // Add SSL configuration for security
  ssl: null, // Set to appropriate SSL options if needed for production
});

// Test the connection and handle errors gracefully
try {
  db.getConnection()
    .then(connection => {
      console.log("✅ Database connected successfully");
      connection.release();
    })
    .catch(err => {
      console.error("❌ Database connection failed:", err.message);
      console.error("Please ensure MySQL server is running and credentials are correct");
    });
} catch (error) {
  console.error("❌ Error initializing database connection:", error.message);
}

export default db;
