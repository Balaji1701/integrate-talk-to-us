# NeemLogic Contact Form with PostgreSQL

This is a full-stack contact form application that stores inquiries in a PostgreSQL database.

## 📋 Project Structure

```
├── neemlogic_talk_to_us_Updated.html  # Frontend form
├── server.js                           # Express backend server
├── init-db.js                          # Database initialization script
├── package.json                        # Node.js dependencies
├── .env                                # Environment variables
└── README.md                           # This file
```

## 🛠️ Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## 📦 Installation

### Step 1: Install Node.js Dependencies

Navigate to the project directory and install dependencies:

```bash
npm install
```

### Step 2: Configure PostgreSQL

1. **Start PostgreSQL** (if not already running)
   - Windows: Open Services and start PostgreSQL, or run from command line
   - Mac: `brew services start postgresql`
   - Linux: `sudo service postgresql start`

2. **Open PostgreSQL** command line:
   ```bash
   psql -U postgres
   ```

3. **Set a password** (if you haven't already):
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_password_here';
   ```

4. **Exit psql:**
   ```sql
   \q
   ```

### Step 3: Configure Environment Variables

Edit the `.env` file and update the database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neemlogic_contacts
DB_USER=postgres
DB_PASSWORD=your_password_here
```

**Important:** Replace `your_password_here` with your actual PostgreSQL password.

### Step 4: Initialize the Database

Run the initialization script to create the database and tables:

```bash
node init-db.js
```

You should see output like:
```
✓ Database "neemlogic_contacts" created
✓ Table "contact_submissions" created/verified
✓ Index on email created
✓ Index on submitted_at created
✓ Database initialization completed successfully!
```

## 🚀 Running the Application

Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
✓ Server running on http://localhost:3000
✓ Database: neemlogic_contacts on localhost:5432
```

## 📝 Usage

1. Open your browser and navigate to **http://localhost:3000**
2. Fill out the contact form
3. Click "Submit inquiry"
4. The data will be saved to PostgreSQL and you'll see a success message

## 🗄️ Database Schema

The `contact_submissions` table stores:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `full_name` | VARCHAR(255) | Full name (required) |
| `email` | VARCHAR(255) | Work email (required) |
| `phone` | VARCHAR(20) | Phone number (required) |
| `country_code` | VARCHAR(10) | Country code like +1, +91 |
| `company_name` | VARCHAR(255) | Company name (required) |
| `job_title` | VARCHAR(255) | Job title (required) |
| `company_size` | VARCHAR(50) | Company size range (optional) |
| `requirements` | TEXT | Requirements description (optional) |
| `submitted_at` | TIMESTAMP | When the form was submitted |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

## 🔍 Querying the Database

To view submitted inquiries in PostgreSQL:

```bash
psql -U postgres -d neemlogic_contacts
```

Then run queries like:

```sql
-- View all submissions
SELECT id, full_name, email, company_name, submitted_at FROM contact_submissions ORDER BY submitted_at DESC;

-- View submissions from today
SELECT * FROM contact_submissions WHERE submitted_at > CURRENT_DATE;

-- Count submissions by company size
SELECT company_size, COUNT(*) FROM contact_submissions GROUP BY company_size;
```

## 🛡️ Validation

The form includes server-side validation for:
- **Name:** 2-100 characters, letters only
- **Email:** Valid email format
- **Phone:** 6-15 digits
- **Company:** 1-255 characters
- **Job Title:** 1-255 characters
- **Requirements:** Max 1000 characters

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL is not running. Start it in your system services.

### Error: "password authentication failed"
- Check your `.env` file and ensure the password matches your PostgreSQL password.

### Error: "database does not exist"
- Run `node init-db.js` again to create the database and tables.

### CORS Issues
- Update `CORS_ORIGIN` in `.env` to match your frontend domain if needed.

## 📌 API Endpoints

### POST `/api/submit-inquiry`
Submits a contact inquiry.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "9876543210",
  "countryCode": "+91",
  "company": "Acme Corp",
  "title": "VP of Technology",
  "companySize": "51-200",
  "requirements": "We need an AI solution for..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "submissionId": 1
}
```

### GET `/api/health`
Health check endpoint.

## 📱 Production Deployment

For production, consider:
1. Using environment-specific configs
2. Adding authentication for database queries
3. Implementing rate limiting
4. Using HTTPS
5. Adding email notifications
6. Setting up proper logging and monitoring

## 📄 License

© 2026 NeemLogic. All rights reserved.
