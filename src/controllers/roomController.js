const Room = require('../models/Room');

exports.listRooms = async (req, res) => {
  const rooms = await Room.find().sort('number');
  res.json(rooms);
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Broadcast the updated room to all connected clients
    const io = req.app.get('io');
    io.emit('roomStatusChanged', room);

    return res.json(room);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createRoom = async (req, res) => {
  const { number, status } = req.body;
  const newRoom = await Room.create({ number, status });
  res.status(201).json(newRoom);
};
