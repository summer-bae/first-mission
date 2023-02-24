const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
        required: true,
        ref: "account",
	},
	isWhisper: {
		type: Boolean,
		default: false,
	},
	toUser: {
		type: mongoose.Types.ObjectId,
		ref: "account",
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: { 
		type: Date,
		required: true,
		default: Date.now,
	},
});

module.exports = mongoose.model('chat', chatSchema);