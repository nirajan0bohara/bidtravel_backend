const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database'); // Use sequelize for Sequelize-based backend
const WebSocket = require('ws');
const http = require('http');
const { seedAdmin } = require('./seeders/admin-seeder');

// Config dotenv
dotenv.config();

// Rest object
const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const wss = new WebSocket.Server({ server }); // Attach WebSocket to server

// Port
const PORT = process.env.PORT || 8000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// WebSocket for real-time notifications
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { userId } = JSON.parse(message);
    ws.userId = userId; // Store user ID for targeted notifications
  });
});

// Broadcast notification to specific user
function notifyUser(userId, message) {
  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

app.set('notifyUser', notifyUser);

// Routes
app.get('/test', (req, res) => {
  res.status(200).send('<h1>Testing first Api </h1>');
});
app.use('/api/auth', require('./routes/auth').authRouter);
app.use('/api/users', require('./routes/User').userRouter);
app.use('/api/requests', require('./routes/requests').requestRouter);
app.use('/api/bids', require('./routes/bids').bidRouter);
app.use('/api/credits', require('./routes/credits').creditRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Listen
sequelize
  .sync({ force: false })
  .then(async () => {
    // await seedAdmin(); // Run the seeder
    console.log('Database Connected Successfully!'.green.bold);
    server.listen(PORT, () => {
      console.log(`Server is Running on port ${PORT}`.bgMagenta.white.bold);
    });
  })
  .catch((error) => {
    console.error('Error while connecting to database: '.red, error);
  });