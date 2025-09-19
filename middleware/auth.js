// middleware/auth.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

function authenticateToken(req, res, next) {
  // Get the token from the 'Authorization' header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return a 401 Unauthorized status
  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    // If the token is invalid or expired, return a 403 Forbidden status
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token.' });
    }
    // If valid, attach the user payload to the request for later use
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = authenticateToken;