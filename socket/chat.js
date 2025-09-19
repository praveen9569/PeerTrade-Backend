// socket/chat.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function setupChat(io) {
  // Socket.io middleware to authenticate connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Unauthorized: No token provided.'));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return next(new Error('Forbidden: Invalid token.'));
      }
      socket.user = user; // Attach user data to the socket object
      next();
    });
  });

  // Listen for new connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`);

    // Listen for incoming chat messages
    socket.on('chat message', (msg) => {
      // Broadcast the message to all other connected clients
      io.emit('chat message', {
        user: socket.user.email,
        text: msg,
        timestamp: new Date().toISOString(),
      });
      console.log(`Message from ${socket.user.email}: ${msg}`);
    });

    // Handle user disconnections
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email}`);
    });
  });
}

module.exports = setupChat;