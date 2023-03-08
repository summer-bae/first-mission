import mongoose from 'mongoose';

export interface publicMessageType {
	_id: mongoose.Types.ObjectId,
	username: string,
	sender: mongoose.Schema.Types.ObjectId,
  message: string,
  createdAt: string,
}

const publicMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account'
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
});

export default mongoose.model('publicMessage', publicMessageSchema);