import mongoose from 'mongoose';

export interface publicRoomType {
	_id: mongoose.Types.ObjectId,
	username: string,
	socketId: string,
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: string,
}


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
    type: String,
  }
});

export default mongoose.model('publicRoom', publicRoomSchema);