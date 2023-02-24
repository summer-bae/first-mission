const socketIo = require('socket.io');

module.exports = (server) => {
	const io = socketIo(server, {
		path: '/socket.io',
	});
	
	// 현재 접속한 유저 리스트
	const connectUserList = [];
	
	// 소켓 연결
	io.on('connection', (socket) => {
		let userId = '';
		const req = socket.request;
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
		console.log('new connect : ', ip, socket.id);
		
		// 소켓 연결 종료
		socket.on('disconnect', () => {
			
			socket.leave(userId);
			
			for (let i in connectUserList) {
				if (connectUserList[i].id === userId) {
					connectUserList.splice(i, 1);
				};
			}
			
			io.emit("getUserList", connectUserList);
			console.log('Client leave : ', ip, socket.id);
		});
		
		// 소켓 연결 에러
		socket.on('error', (error) => {
			console.error(error);
		});
		
		// 채팅
		socket.on('toMessage', (obj) => {
			if (obj.isWhisper) {
				// 귓속말 채팅
				io.to(obj.toSocketId).emit('fromMessage', obj);
				io.to(socket.id).emit('fromMessage', obj);
			} else {
				// 전체 채팅
				io.emit('fromMessage', obj);
			}
		});
		
		// 채팅 들어왔을 때 실행
		socket.on('joinChat', (info) => {
			userId = info.id;
			info.socketId = socket.id;
			connectUserList.push(info);
			socket.join(info.id);
			io.emit("getUserList", connectUserList);
		});
		
	});
};