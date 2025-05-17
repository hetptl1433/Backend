const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true    // e.g. “101”, “102”, …
  },
  status: {
    type: String,
    enum: ['clean','dirty','unavailable'],
    default: 'dirty'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
