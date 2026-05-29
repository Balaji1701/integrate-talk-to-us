# Getting Started - Step-by-Step Guide for Windows

## Prerequisites Check

Before starting, make sure you have:

### 1. Node.js Installed
```
Windows Key → Search "node" or "npm"
If found, great! If not, download from https://nodejs.org/
```

**Check if installed:**
```
Open Command Prompt or PowerShell and run:
node --version
npm --version
```

Should show version numbers (e.g., v18.0.0, 9.0.0)

### 2. PostgreSQL Installed
```
Windows Key → Search "PostgreSQL" 
If found in Programs list, great! If not, download from https://www.postgresql.org/download/windows/
```

**Check if installed:**
```
Open Command Prompt and run:
psql --version
```

Should show version number (e.g., psql (PostgreSQL) 14.0)

---

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
# Open PowerShell or Command Prompt
# Navigate to project folder
cd C:\Users\<YourUsername>\Desktop\Integrate_talk-to-us

# Verify you're in right folder (should see HTML files)
dir
```

Expected output includes:
- neemlogic_talk_to_us_Updated.html
- admin.html
- server.js
- package.json

### Step 2: Install Node Dependencies

```bash
npm install
```

This will:
- Read package.json
- Download ~50 MB of dependencies
- Create node_modules folder (takes 1-3 minutes)
- Show success message

Expected output ends with:
```
added 123 packages in 45s
```

### Step 3: Start PostgreSQL

**Option A: Using Services (Recommended)**
```
1. Press Windows Key + R
2. Type: services.msc
3. Find: PostgreSQL
4. Right-click → Start (if not already running)
5. Status should show: Running
```

**Option B: Command Line**
```bash
# May need to run as Administrator
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

**Verify it's running:**
```bash
psql -U postgres
```

If successful, you'll see:
```
postgres=#
```

Type `\q` to exit.

### Step 4: Get Your PostgreSQL Password

You set this during PostgreSQL installation. If you don't remember:

```bash
# In PostgreSQL command line:
psql -U postgres

# You'll be prompted for password
# This is the password to use in .env file
```

### Step 5: Configure Environment File

```bash
# Open .env file in text editor
# Find these lines:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neemlogic_contacts
DB_USER=postgres
DB_PASSWORD=your_password_here

# Replace "your_password_here" with your actual PostgreSQL password
# Save the file
```

**Example after editing:**
```
DB_PASSWORD=MySecurePassword123
```

### Step 6: Initialize Database

```bash
# Still in project directory, run:
node init-db.js
```

Expected output:
```
✓ Database "neemlogic_contacts" created
✓ Table "contact_submissions" created/verified
✓ Index on email created
✓ Index on submitted_at created
✓ Database initialization completed successfully!

Database: neemlogic_contacts
Host: localhost:5432
User: postgres
```

**If you get errors:**
1. Check PostgreSQL is running (see Step 3)
2. Verify password in .env file
3. Check PostgreSQL version (should be 12+)

### Step 7: Start the Server

```bash
npm start
```

Expected output:
```
✓ Server running on http://localhost:3000
✓ Database: neemlogic_contacts on localhost:5432
```

**Server is now running!**

### Step 8: Test in Browser

```
1. Open web browser (Chrome, Edge, Firefox, Safari)
2. Go to: http://localhost:3000
3. You should see the contact form
4. Form should load with styling
```

### Step 9: Test Form Submission

```
1. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Company: Test Corp
   - Title: Test Engineer
2. Click "Submit inquiry"
3. Should show success message
4. Success message means data was saved!
```

### Step 10: Verify Data in Database

```bash
# Open new PowerShell/Command Prompt window (keep server running)
psql -U postgres -d neemlogic_contacts

# In PostgreSQL, run:
SELECT * FROM contact_submissions;

# Should show your test submission
# Exit with: \q
```

---

## Optional: View Admin Dashboard

```
1. Keep server running
2. In browser, go to: http://localhost:3000/admin
3. Should see:
   - Statistics (total, today, week, month)
   - Table of all submissions
   - Search box
   - Export button
```

---

## Stopping the Server

```bash
# In PowerShell/Command Prompt where server is running
Press: Ctrl + C

# Server stops
# Next time: npm start to restart
```

---

## Running Again Later

When you want to use it again:

```bash
1. Start PostgreSQL (Services → PostgreSQL → Start)
2. Open PowerShell/Command Prompt
3. Navigate to project folder: cd Desktop\Integrate_talk-to-us
4. Run: npm start
5. Open browser to http://localhost:3000
```

---

## Common Issues (Windows Specific)

### PowerShell shows "Execution Policy" error

```bash
# If you see: "cannot be loaded because running scripts is disabled"
# Run this command first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### PostgreSQL password prompt appears but won't accept password

```
# Check:
1. PostgreSQL is running (Services)
2. Password in .env file matches
3. No extra spaces in password
4. Password is correct (try psql -U postgres manually)
```

### Port 3000 already in use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Output shows: TCP    0.0.0.0:3000  LISTENING  <PID>
# Kill the process
taskkill /PID <PID> /F

# Then run npm start again
```

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If still fails, check:
# - Internet connection
# - Node.js version (should be 14+)
# - Disk space available
```

### PostgreSQL won't start

```bash
# Try these in Command Prompt:
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# If it says "server already running", that's good!
# If it fails, check:
# - PostgreSQL is installed
# - Installation path is correct
# - Data directory exists
# - Run as Administrator
```

---

## Useful Windows Commands

```bash
# Check what's running on port 3000
netstat -ano | findstr :3000

# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version

# List all npm packages installed
npm list

# See current directory
cd

# Navigate to desktop
cd Desktop

# List files in current directory
dir

# Open file in notepad
notepad .env

# Create new file
type nul > filename.txt
```

---

## Development vs Production

### Development (What you just set up)
- ✅ Good for testing
- ✅ Easy to debug
- ✅ CORS allows all origins
- ✅ Verbose error messages

### For Production Later
- Change NODE_ENV=production in .env
- Set CORS_ORIGIN to your domain
- Use HTTPS
- Set strong database password
- Configure backups
- Add authentication

---

## File Locations (Windows)

```
Project Folder:
C:\Users\<YourUsername>\Desktop\Integrate_talk-to-us\

Project Files:
- server.js
- admin.html
- package.json
- .env

PostgreSQL Data:
C:\Program Files\PostgreSQL\14\data\

Node Modules:
C:\Users\<YourUsername>\Desktop\Integrate_talk-to-us\node_modules\
```

---

## Next Steps

1. **Test thoroughly** - Submit multiple forms to test
2. **Share with team** - They can access http://localhost:3000 if on same network
3. **Create more fields** - Add fields to form by editing HTML
4. **Add features** - Email notifications, CRM sync, etc.
5. **Deploy** - Move to production server or cloud

---

## Getting Help

1. **Read documentation**
   - START_HERE.md - Quick start
   - README.md - Full docs
   - FAQ.md - Common issues
   
2. **Check logs**
   - Server logs in PowerShell where npm start is running
   - Browser console (F12 → Console)
   - Database logs in PostgreSQL

3. **Debug tips**
   - Check PostgreSQL is running
   - Verify .env password
   - Verify port 3000 is free
   - Check internet connection

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start server | `npm start` |
| Stop server | Ctrl + C |
| Initialize database | `node init-db.js` |
| Connect to database | `psql -U postgres -d neemlogic_contacts` |
| View submissions | In database: `SELECT * FROM contact_submissions;` |
| Check Node version | `node --version` |
| Check npm version | `npm --version` |

---

## ✅ Quick Check List

- [ ] Node.js installed (check: `node --version`)
- [ ] PostgreSQL installed (check: `psql --version`)
- [ ] PostgreSQL running (Services: PostgreSQL → Running)
- [ ] Dependencies installed (`npm install` completed)
- [ ] .env password updated
- [ ] Database initialized (`node init-db.js` succeeded)
- [ ] Server started (`npm start` showing ✓ messages)
- [ ] Form loads (`http://localhost:3000` shows form)
- [ ] Form submits (click Submit → see success message)
- [ ] Data saved (database shows submissions)

**All checked? You're ready to go! 🚀**

---

## Support Files

Need help? Check these:
- **START_HERE.md** - Quick overview
- **README.md** - Comprehensive guide
- **QUICK_REFERENCE.md** - Common commands
- **FAQ.md** - Questions & answers
- **ARCHITECTURE.md** - How it works

---

**You've got this! 💪**
