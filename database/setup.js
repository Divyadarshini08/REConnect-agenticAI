import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '../../backend/.env' });

async function setupDatabase() {
  console.log('🚀 Starting database setup...');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');

    // Connect to MySQL without specifying a database initially
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create the database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS `reconnect` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('✅ Database "reconnect" created or already exists');

    // Use the reconnect database
    await connection.execute('USE `reconnect`;');

    // Split the schema file into individual statements and execute them
    const statements = schemaSQL.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await connection.execute(statement);
      } catch (stmtErr) {
        // Skip errors that occur when tables already exist
        if (!stmtErr.message.includes('already exists')) {
          console.warn(`⚠️  Warning executing statement: ${stmtErr.message}`);
        }
      }
    }

    console.log('✅ Database schema created successfully');

    // Close the connection
    await connection.end();
    console.log('🔒 Database connection closed');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Make sure your backend .env file has the correct database credentials');
    console.log('   2. Start the backend server with: cd backend && npm run dev');
    console.log('   3. Start the frontend with: cd frontend && npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupDatabase();
}

export { setupDatabase };