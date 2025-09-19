// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../src/db/schema');
const { db } = require('../src/db/db');
const { eq } = require('drizzle-orm');

const router = express.Router();

// A secret key for signing JWTs. Store this in your .env file!
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

// --- User Registration Route ---
router.post('/register', async (req, res) => {
  const { email, password, name, course, year, contactInfo } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if the email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash the password for security
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [newUser] = await db.insert(users).values({
      email,
      passwordHash,
      name,
      course,
      year,
      contactInfo,
    }).returning({ id: users.id, email: users.email });

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// --- User Login Route ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create a JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;