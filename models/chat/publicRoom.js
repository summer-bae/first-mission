const mongoose = require('mongoose');

const publicRoomSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('publicRoom', publicRoomSchema);