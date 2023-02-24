const socketIo = require('socket.io');

module.exports = (server) => {
	const io = socketIo(server, {
		path: '/socket.io'
	});
	
	const connectUserList = [];
	
	io.on('connection', (socket) => {
		const userId = '';
		
		const req = socket.request;
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
		console.log('new', ip, socket.id);
		
		socket.on('disconnect', () => {
			socket.leave(userId);
			
			for (let i in connectUserList) {
				if (connectUserList[i].username === userId) {
					connectUserList.splice(i, 1);
				};
			}
			
			io.emit("getUserList", connectUserList);
			console.log('leave client', ip, socket.id);
		})
	})
}