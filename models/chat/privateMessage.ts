import mongoose from 'mongoose';

export interface privateMessageType {
	_id: mongoose.Types.ObjectId,
	username: string,
	sender: mongoose.Schema.Types.ObjectId,
  message: string,
  receiver: mongoose.Schema.Types.ObjectId,
  receiverName: string,
  createdAt: string,
}

const privateMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  username: {
    type: String,
    require: true
  },
  message: {
    type: String,
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
});

export default mongoose.model('privateMessage', privateMessageSchema);