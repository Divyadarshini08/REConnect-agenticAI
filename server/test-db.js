// Simple test file to verify database connection with sql.js
import db from './db.js';

console.log('Testing database connection...');

// Test inserting and retrieving a sample record
(async () => {
  try {
    // Insert a test user
    await db.run("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", 
      "Test User", "test@example.com", "hashed_password", "student");
    
    // Retrieve the test user
    const stmt = await db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get("test@example.com");
    
    console.log('Test user retrieved:', user);
    
    // Clean up - delete test user
    await db.run("DELETE FROM users WHERE email = ?", "test@example.com");
    
    console.log('✅ Database connection test passed!');
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
  }
})();