const { Pool } = require('pg');
require('dotenv').config();

const useDatabaseUrl = !!process.env.DATABASE_URL;

const adminPool = useDatabaseUrl
  ? null
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres'
    });

const targetPool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
);

async function createSchema(client) {
  await client.query(`
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

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
    ON contact_submissions(email);
  `);
  console.log('✓ Index on email created');

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at 
    ON contact_submissions(submitted_at DESC);
  `);
  console.log('✓ Index on submitted_at created');
}

async function initializeDatabase() {
  console.log('Initializing database...');

  if (useDatabaseUrl) {
    console.log('Using DATABASE_URL; skipping database creation step.');
  } else {
    const client = await adminPool.connect();
    try {
      const { rows } = await client.query(
        `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
        [process.env.DB_NAME]
      );

      if (rows.length === 0) {
        await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`✓ Database "${process.env.DB_NAME}" created`);
      } else {
        console.log(`✓ Database "${process.env.DB_NAME}" already exists`);
      }
    } catch (err) {
      console.error('Error creating database:', err);
      throw err;
    } finally {
      client.release();
      await adminPool.end();
    }
  }

  const dbClient = await targetPool.connect();
  try {
    await createSchema(dbClient);
    console.log('\n✓ Database initialization completed successfully!');
    if (useDatabaseUrl) {
      console.log('Database connection: DATABASE_URL');
    } else {
      console.log(`\nDatabase: ${process.env.DB_NAME}`);
      console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`User: ${process.env.DB_USER}`);
    }
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  } finally {
    dbClient.release();
    await targetPool.end();
  }
}

initializeDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
