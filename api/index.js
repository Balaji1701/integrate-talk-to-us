const app = require('../server');

// Vercel expects a function handler for serverless functions.
// Wrap the Express app so Vercel can invoke it per request.
module.exports = (req, res) => app(req, res);
