# Frequently Asked Questions (FAQ) & Troubleshooting

## ❓ General Questions

### Q: Do I need to install anything other than Node.js and PostgreSQL?
**A:** No, that's it! npm comes with Node.js. Once you run `npm install`, all dependencies are installed.

### Q: Can I use this on Windows/Mac/Linux?
**A:** Yes! It works on all operating systems. PostgreSQL and Node.js are cross-platform.

### Q: What if I don't have PostgreSQL installed?
**A:** Download it from https://www.postgresql.org/download/
- Windows: Download installer and run
- Mac: Use Homebrew: `brew install postgresql`
- Linux: Use package manager: `sudo apt-get install postgresql`

### Q: Can I change the database name?
**A:** Yes! Update `DB_NAME` in `.env` file, then run `node init-db.js` again.

### Q: How many submissions can the database store?
**A:** PostgreSQL can store millions of records. No practical limit for your use case.

### Q: Is the data secure?
**A:** Yes, with these practices:
- Inputs are validated server-side
- Queries use parameterized statements (prevent SQL injection)
- .env file keeps passwords private
- For production, use HTTPS and proper authentication

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'express'"
**Solution:** Run `npm install` in the project directory.

### Problem: "Error: connect ECONNREFUSED 127.0.0.1:5432"
**Solution:** PostgreSQL is not running.
- Windows: Open Services → PostgreSQL → Right-click → Start
- Mac: `brew services start postgresql`
- Linux: `sudo service postgresql start`

To verify PostgreSQL is running:
```bash
psql -U postgres
```

### Problem: "FATAL: password authentication failed for user 'postgres'"
**Solution:** Your password is incorrect.
1. Check `.env` file `DB_PASSWORD` value
2. Verify with PostgreSQL:
```bash
psql -U postgres -h localhost
```
3. If you forgot the password, reset it:
```bash
psql -U postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
```

### Problem: "Error: database 'neemlogic_contacts' does not exist"
**Solution:** Run database initialization:
```bash
node init-db.js
```

Expected output:
```
✓ Database "neemlogic_contacts" created
✓ Table "contact_submissions" created/verified
```

### Problem: "Error: relation 'contact_submissions' does not exist"
**Solution:** The table wasn't created. Run:
```bash
node init-db.js
```

### Problem: "Port 3000 is already in use"
**Solution:** Either change the port or kill the existing process.

Change port in `.env`:
```
PORT=3001
```

Or kill the existing process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Problem: Form shows error "Submission failed"
**Solution:** Check browser console (F12 → Console) and server logs.
- Verify server is running: `npm start`
- Check network tab (F12 → Network) for failed requests
- Look for error messages in terminal

### Problem: "CORS error" in browser console
**Solution:** Update `.env` CORS_ORIGIN:
```
CORS_ORIGIN=http://localhost:3000
```

Or for all domains (not recommended for production):
```
CORS_ORIGIN=*
```

### Problem: Form validation passes but doesn't submit
**Solution:**
1. Check browser console for JavaScript errors
2. Open DevTools (F12 → Network)
3. Verify the API request is being sent
4. Check server logs for errors

### Problem: Data submitted but not showing in database
**Solution:** Verify data was saved:
```bash
psql -U postgres -d neemlogic_contacts
SELECT COUNT(*) FROM contact_submissions;
```

If count is 0, check server logs for errors.

### Problem: Admin dashboard shows "Loading..." forever
**Solution:**
1. Verify `/api/submissions` endpoint works:
   ```bash
   curl http://localhost:3000/api/submissions
   ```
2. Check browser console for errors
3. Check server logs

### Problem: npm install fails
**Solution:** Try clearing cache:
```bash
npm cache clean --force
npm install
```

### Problem: Server starts but form won't load
**Solution:**
1. Check if server is running: `npm start`
2. Browser shows "Cannot GET /" - check if html file exists
3. Port mismatch - verify server logs show correct port

---

## 🔧 Configuration

### Changing Email Validation Rules
Edit `server.js` line ~50 to modify validation:
```javascript
body('email')
    .trim()
    .isEmail()  // Change this rule
    .withMessage('Invalid email address')
    .normalizeEmail(),
```

### Changing Database Timeout
Edit `.env`:
```
DB_CONNECTION_TIMEOUT=5000  # milliseconds
DB_IDLE_TIMEOUT=30000       # milliseconds
```

### Changing Form Field Limits
Edit `server.js` validation section:
```javascript
body('requirements')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })  // Change max length
```

### Adding New Form Fields
1. Add to HTML form
2. Update validation in `server.js`
3. Add database column:
```sql
ALTER TABLE contact_submissions ADD COLUMN new_field VARCHAR(255);
```

---

## 📊 Performance

### The form is slow to load
- Clear browser cache (Ctrl+Shift+Delete)
- Check network speed (F12 → Network)
- Verify server is running locally

### The form submission is slow
- Check database is running: `psql -U postgres`
- Verify network latency: DevTools → Network → check request time
- Check server logs for slow queries

### Admin dashboard is slow with many records
- Database has indexes - already optimized
- Limit results in admin.html (currently 1000)
- Add pagination for production use

---

## 🔐 Security Best Practices

### For Development (What you have now)
✓ Good for local testing
✓ Input validation enabled
✓ CORS allows all (fine for local testing)

### For Production
⚠️ Do these before going live:

1. **Use HTTPS**
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Restrict CORS**
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```

3. **Add Authentication**
   - Require API key or JWT token
   - Protect admin endpoints

4. **Set strong database password**
   ```bash
   psql -U postgres
   ALTER USER postgres WITH PASSWORD 'strong_random_password';
   ```

5. **Use environment-specific configs**
   - Different .env for development/production
   - Never commit .env to git

6. **Enable SSL for database**
   ```
   DB_SSL=require
   ```

7. **Rate limiting**
   - Add limit on form submissions per IP
   - Prevent spam/abuse

8. **Regular backups**
   ```bash
   pg_dump -U postgres neemlogic_contacts > backup.sql
   ```

---

## 📱 Deployment Questions

### Q: Can I host this on Heroku?
**A:** Yes! Push to Heroku and set environment variables:
```bash
heroku config:set DB_HOST=...
heroku config:set DB_USER=...
heroku config:set DB_PASSWORD=...
```

### Q: Can I use AWS/Google Cloud?
**A:** Yes! Same approach - set environment variables in cloud console.

### Q: Do I need to modify code for production?
**A:** Minimal changes needed:
- Change NODE_ENV to "production"
- Update CORS_ORIGIN
- Add authentication if needed
- Set production database credentials

### Q: How do I backup the data?
**A:** PostgreSQL backup:
```bash
pg_dump -U postgres -d neemlogic_contacts > backup.sql
```

Restore:
```bash
psql -U postgres -d neemlogic_contacts < backup.sql
```

---

## 🆘 Getting More Help

### Check These Files First
1. **START_HERE.md** - Quick start
2. **README.md** - Comprehensive docs
3. **QUICK_REFERENCE.md** - Common commands
4. **ARCHITECTURE.md** - System design

### Debug Steps
1. Check browser console (F12 → Console)
2. Check server logs (terminal where you ran `npm start`)
3. Check database:
   ```bash
   psql -U postgres -d neemlogic_contacts
   SELECT * FROM contact_submissions;
   ```

### Common Debug Commands
```bash
# Test database connection
psql -U postgres -d neemlogic_contacts

# View server logs (if started with npm start)
# Logs appear in terminal

# Test API endpoint
curl http://localhost:3000/api/health

# Check if port is in use
netstat -ano | findstr :3000

# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version
```

---

## 📝 Logs and Monitoring

### Server Logs
Visible in terminal when running `npm start`. Includes:
- Server startup message
- Incoming requests
- Database queries
- Errors

### Browser Console Logs
Press F12 → Console tab shows:
- Form validation messages
- API response messages
- JavaScript errors

### Database Logs
PostgreSQL logs are usually in:
- Windows: `C:\Program Files\PostgreSQL\14\data\log`
- Mac: `/usr/local/var/postgres/`
- Linux: `/var/log/postgresql/`

### Enable Verbose Logging
Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

---

## ✅ Pre-Launch Checklist

Before going live:
- [ ] PostgreSQL is installed and running
- [ ] npm dependencies are installed (`npm install`)
- [ ] Database is initialized (`node init-db.js`)
- [ ] .env file is configured with credentials
- [ ] Server starts without errors (`npm start`)
- [ ] Form loads at http://localhost:3000
- [ ] Can submit form and see success message
- [ ] Data appears in database
- [ ] Admin dashboard works (http://localhost:3000/admin)
- [ ] Can export CSV from admin dashboard

Once all items are checked, you're ready!

---

## 💬 Questions or Issues?

1. Check this FAQ file
2. Review README.md for detailed docs
3. Check QUICK_REFERENCE.md for commands
4. Review browser/server logs
5. Verify PostgreSQL is running
6. Verify all .env variables are set correctly

**You've got this! 🚀**
