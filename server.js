const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files (HTML)

// PostgreSQL Connection Pool
const poolConfig = process.env.DATABASE_URL
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
    };

const pool = new Pool({
  ...poolConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Validation middleware
const validateSubmission = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(/^\d{6,15}$/)
    .withMessage('Phone must be 6-15 digits'),
  
  body('countryCode')
    .trim()
    .notEmpty()
    .withMessage('Country code is required'),
  
  body('company')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Company name is required'),
  
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Job title is required'),
  
  body('companySize')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }),
  
  body('requirements')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
];

// API endpoint to submit form
app.post('/api/submit-inquiry', validateSubmission, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, countryCode, company, title, companySize, requirements } = req.body;

    // Insert into database
    const query = `
      INSERT INTO contact_submissions 
      (full_name, email, phone, country_code, company_name, job_title, company_size, requirements, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, submitted_at;
    `;

    const result = await pool.query(query, [
      name,
      email,
      phone,
      countryCode,
      company,
      title,
      companySize || null,
      requirements || null
    ]);

    res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully',
      submissionId: result.rows[0].id
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all submissions (for admin dashboard)
app.get('/api/submissions', async (req, res) => {
  try {
    const query = `
      SELECT * FROM contact_submissions 
      ORDER BY submitted_at DESC 
      LIMIT 1000;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/neemlogic_talk_to_us_Updated.html');
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server when running locally
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  });

  // Graceful shutdown for local development
  process.on('SIGINT', () => {
    pool.end(() => {
      console.log('Pool closed');
      process.exit(0);
    });
  });
}

module.exports = app;
