# Quick Reference Guide

## Starting the Application

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Database Commands

### Initialize Database
```bash
node init-db.js
```

### Connect to Database
```bash
psql -U postgres -d neemlogic_contacts
```

### View All Submissions
```sql
SELECT * FROM contact_submissions ORDER BY submitted_at DESC;
```

### View Today's Submissions
```sql
SELECT * FROM contact_submissions WHERE DATE(submitted_at) = CURRENT_DATE;
```

### Count Submissions by Company
```sql
SELECT company_name, COUNT(*) as count FROM contact_submissions GROUP BY company_name ORDER BY count DESC;
```

### Export Data to CSV
```bash
psql -U postgres -d neemlogic_contacts -c "COPY contact_submissions TO STDOUT WITH CSV HEADER;" > submissions.csv
```

### Delete All Submissions (BE CAREFUL!)
```sql
TRUNCATE TABLE contact_submissions RESTART IDENTITY;
```

## Common Issues & Solutions

### Form not submitting
- Check browser console for errors (F12 → Console)
- Ensure server is running on localhost:3000
- Check that PostgreSQL is running

### Database connection fails
- Verify PostgreSQL is running: `psql -U postgres`
- Check .env credentials
- Restart PostgreSQL service

### CORS errors
- Update CORS_ORIGIN in .env if using different domain
- Default allows all (*), change to specific domain for production

### Port 3000 already in use
```bash
# Windows - Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

## Environment Variables (.env)

```
PORT=3000                    # Server port
NODE_ENV=development         # development or production
DB_HOST=localhost            # PostgreSQL host
DB_PORT=5432                 # PostgreSQL port
DB_NAME=neemlogic_contacts   # Database name
DB_USER=postgres             # PostgreSQL user
DB_PASSWORD=                 # PostgreSQL password
CORS_ORIGIN=*                # CORS allowed origins
```

## File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express server with API endpoints |
| `init-db.js` | Database initialization script |
| `neemlogic_talk_to_us_Updated.html` | Frontend form |
| `package.json` | Node.js dependencies |
| `.env` | Environment configuration |
| `.gitignore` | Git ignore rules |
| `README.md` | Full documentation |

## Testing the API

### Using cURL
```bash
curl -X POST http://localhost:3000/api/submit-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "countryCode": "+1",
    "company": "Test Company",
    "title": "Test Title",
    "companySize": "51-200",
    "requirements": "Test requirements"
  }'
```

### Using Postman
1. Create new POST request to `http://localhost:3000/api/submit-inquiry`
2. Set Content-Type header to `application/json`
3. Copy the JSON body from the cURL example above
4. Send request

## Monitoring the Server

### View live logs while server is running
- Server logs appear in terminal
- Check browser DevTools (F12) for client-side errors

### Enable verbose logging
Add this to `server.js` after middleware setup:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## Performance Tips

1. **Database optimization:** Indexes are created on email and submitted_at
2. **Connection pooling:** Configured with max 20 connections
3. **Validation:** Client-side validation reduces server load
4. **Static files:** HTML is served directly from Express for speed

## Security Notes

- All inputs are validated server-side
- Use HTTPS in production
- Set CORS_ORIGIN to specific domain in production
- Use strong database passwords
- Keep .env file private
- Update npm packages regularly: `npm audit`

## Next Steps

- [ ] Add email notifications for new submissions
- [ ] Create admin dashboard to view submissions
- [ ] Add pagination to submissions list
- [ ] Implement user authentication
- [ ] Add request rate limiting
- [ ] Deploy to cloud (Heroku, AWS, etc.)
- [ ] Set up automated backups
