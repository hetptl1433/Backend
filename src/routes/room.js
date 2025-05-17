const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { listRooms, updateStatus, createRoom } = require('../controllers/roomController');

// Apply auth to *all* /api/rooms routes
router.use(auth);

// Anyone with role housekeeping, frontdesk, or admin can GET /api/rooms
router.get('/', authorize(['housekeeping','frontdesk','admin']), listRooms);

// Only housekeeping & admin can flip status
router.put('/:id', authorize(['housekeeping','admin']), updateStatus);

// Only admin can POST new rooms
router.post('/', authorize(['admin']), createRoom);

module.exports = router;
