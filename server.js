// server.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');
const { db } = require('./src/db/db');
const { users } = require('./src/db/schema');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const setupChat = require('./socket/chat');
const { migrate } = require('drizzle-orm/node-postgres/migrator');

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());

// A simple function to run migrations on server startup
const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    // It's a good practice to exit the process if migrations fail
    process.exit(1); 
  }
};

// Set up the chat functionality
setupChat(io);

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the CampusSwap API!');
});

// Run migrations and then start the server
runMigrations().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server after migrations:', err);
});
