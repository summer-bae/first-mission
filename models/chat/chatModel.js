const mongoose = require('mongoose');

const chatSchema = {
	user: {
		type: String,
        required: true,
        // ref: "account",
	},
	isWhisper: {
		type: Boolean,
		default: false,
	},
	toUser: {
		type: String,
		// ref: "account",
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
};

module.exports = mongoose.model('chat', chatSchema);
