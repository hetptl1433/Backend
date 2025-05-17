// index.js (project root)
require('dotenv').config();

const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');
const cors     = require('cors');
const morgan   = require('morgan');
const fs       = require('fs');
const path     = require('path');
const { Server } = require('socket.io');

const app = express();

// 1) Logger
app.use(morgan('dev')); // logs method, url, status, response time

// 2) Body parsing + CORS
app.use(cors());
app.use(express.json());

// 3) HTTP server + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' } // adjust origin as needed
});
// Make io available in routes/controllers via app.get('io')
app.set('io', io);

// 4) Dynamic route loader
//    Mount each router at /api/<filename>
const routesPath = path.join(__dirname, 'src', 'routes');
fs.readdirSync(routesPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const routeName = path.basename(file, '.js');  // e.g. "auth", "rooms"
    const router    = require(path.join(routesPath, file));
    app.use(`/api/${routeName}`, router);
    console.log(`Mounted /api/${routeName} → ${file}`);
  });

// 5) MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('DB error:', err));

// 6) Socket.IO connection logging (optional)
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// 7) Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
