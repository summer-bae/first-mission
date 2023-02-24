const router = require('express').Router();
const modChat = require('../../../models/chat');
const modAccount = require('../../../models/account');
const Error = require('../util/error');

const findAllChats = async (user) => {
	const allChats = [];
	
	const currentUser = await modAccount.findOne({ id: user });
	
	const chats = await modChat.find().or([
		{ toUser: currentUser }, { user: currentUser }, { isWhisper: false }
	])
	.populate(['user', 'toUser'])
	.sort('createdAt');
	
	chats.forEach((array) => {
		const toUserId = array.toUser ? array.toUser.id : '';
		
		allChats.push({
			user: array.user.id,
			toUser: toUserId,
			type: array.type,
			message: array.message,
		});
	})
	
	return allChats;
}

const addChat = async (req) => {
	const data = req.body;
	
	const user = await modAccount.findOne({ id: data.user });
	data.user = user._id;
	
	if (data.isWhisper) {
		const toUser = await modAccount.findOne({ id: data.toUser });
		data.toUser = toUser._id;
	}
	
	const isAddChat = await modChat.create(data);
	
	return true;
}

router.get('/all-chats', async (req, res, next) => {
	try {
		const ret = await findAllChats(req.query.id);
		res.send(ret);
	} catch(err) {
		console.error(err);
	}
});

router.post('/chat', async (req, res, next) => {
	try {
		const ret = await addChat(req);
		res.send(ret);
	} catch(err) {
		console.error(err);
	}
});

module.export = router;