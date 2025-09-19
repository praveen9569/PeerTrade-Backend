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

// Test database connection on server start
db.select().from(users).then(() => console.log('Database connected')).catch((err) => console.error('Database connection error:', err));

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

// Set up the chat functionality
setupChat(io);

app.get('/', (req, res) => {
  res.send('Welcome to the CampusSwap API!');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});