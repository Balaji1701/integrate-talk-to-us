const { Pool } = require('pg');
require('dotenv').config();

// Create a connection to PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres' // Connect to default postgres database to create new one
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing database...');

    // Create database if it doesn't exist
    await client.query(`
      SELECT datname FROM pg_catalog.pg_database WHERE datname = $1
    `, [process.env.DB_NAME]);

    // Drop existing database (optional - for fresh start)
    // await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

    // Create new database
    try {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✓ Database "${process.env.DB_NAME}" created`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`✓ Database "${process.env.DB_NAME}" already exists`);
      } else {
        throw err;
      }
    }

  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }

  // Now connect to the new database and create the table
  const dbPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  const dbClient = await dbPool.connect();

  try {
    // Create contact_submissions table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        country_code VARCHAR(10) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        company_size VARCHAR(50),
        requirements TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Table "contact_submissions" created/verified');

    // Create index on email for faster queries
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
      ON contact_submissions(email);
    `);
    console.log('✓ Index on email created');

    // Create index on submitted_at for sorting
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at 
      ON contact_submissions(submitted_at DESC);
    `);
    console.log('✓ Index on submitted_at created');

    console.log('\n✓ Database initialization completed successfully!');
    console.log(`\nDatabase: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);

  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await dbClient.end();
    await dbPool.end();
  }
}

initializeDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
