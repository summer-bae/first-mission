const socketIo = require('socket.io');

const User = require('../../models/account/account');
const PublicRoom = require('../../models/chat/publicRoom');
const PrivateMessage = require('../../models/chat/privateMessage');
const PublicMessage = require('../../models/chat/publicMessage');

module.exports = (server) => {
	const io = socketIo(server, {
		path: '/socket.io',
	});

	io.on('connection', (socket) => {
		console.log('new connection', socket.id);

		socket.on('enter public room', (username) => {
			User.findOne({ id: username }, (err, user) => {
				if (err) throw err;
				if (!user) {
					console.log('존재하는 유저가 아닙니다.');
				} else {
					PublicRoom.findOne({ username: username }, (err, participant) => {
						if (err) throw err;
						if (!participant) {
							//참여자 정보가 없다면 publicRoom에 참여자로 저장
							const publicRoom = new PublicRoom({
								username: username,
								socketId: socket.id,
								userId: user._id,
								createdAt: Date.now(),
							});
							publicRoom.save((err) => {
								if (err) throw err;
								// 참여자로 저장이 됐다면
								io.emit('success public room');
							});
						} else {
							// 만약 저장되어있는 socket이 현재 연결되어있는 소켓이 아니라면 (이력만 남아있거나 페이지 새로고침했을경우)
							// 이후 동일하게 새롭게 로그인한 socket에 id를 저장하고 알림
							participant.socketId = socket.id;
							participant.createdAt = Date.now();
							participant.save((err) => {
								if (err) throw err;
								io.emit('success public room');
							});
						}
					});
				}
			});
		});

		// 전체 유저 리스트
		getClientList = () => {
			PublicRoom.find({}).exec((err, user) => {
				if (err) throw err;
				let connectedUser = [];
				user.forEach((value) => {
					connectedUser.push(value);
				});
				io.emit('success get users', connectedUser);
			});
		};

		// 참여자 목록
		socket.on('get all users', () => {
			getClientList();
		});

		// 클라이언트에게 전체 메시지를 받으면
		socket.on('public send message', (username, msg) => {
			User.findOne({ id: username }, (err, user) => {
				if (err) throw err;
				else {
					PublicRoom.findOne({ username: username }, (err, participant) => {
						if (err) throw err;
						else {
							// 전체 채팅 내용 저장
							const publicMessage = new PublicMessage({
								sender: user._id,
								username: username,
								message: msg,
								createdAt: Date.now(),
							});

							publicMessage.save((err) => {
								if (err) throw err;
								else {
									console.log("public send message!");
									// 채팅 내용이 저장 됐다면
									io.emit('public message', publicMessage);
								}
							});
						}
					});
				}
			});
		});

		//모든 전체 채팅 내용
		socket.on('get public message', (username) => {
			// 요청한 사용자의 socket id검색
			PublicRoom.findOne({ username: username }, (err, user) => {
				if (err) throw err;
				else {
					PublicMessage.find({})
						.sort({ createdAt: 'asc' })
						.exec((err, messages) => {
							if (err) throw err;
							// 요청한 클라이언트에게 전달 채팅 내역 전달
							io.to(socket.id).emit('public all message', messages);
						});
				}
			});
		});

		// 귓속말 채팅 보내기
		socket.on('private send message', (from, to, msg) => {
			console.log(`${from} 님이 ${to}님에게 ${msg} 를 보냈습니다.`);

			// 두 유저가 존재하는 유저인지 확인
			Promise.all([User.findOne({ id: from }), User.findOne({ id: to })])
				.then((users) => {
					const [fromUser, toUser] = users;
					if (fromUser.length !== 0 && toUser.length !== 0) {
						//두 유저가 존재한다면
						const privateMessage = new PrivateMessage({
							sender: fromUser._id,
							username: from,
							message: msg,
							receiver: toUser._id,
							receiverName: to,
							createdAt: Date.now(),
						});
						// 귓속말 저장
						privateMessage.save((err) => {
							if (err) throw err;
							else {
								// 저장이 완료되면 귓속말 보내기
								io.emit('private message', privateMessage);
							}
						});
					} else {
						//둘 중 한 명이라도 존재 하지 않는다면
						console.log('존재하지 않는 유저입니다.');
					}
				})
				.catch((err) => {
					throw err;
				});
		});

		// 귓속말 채팅 내용
		socket.on('get private message', (from, to) => {
			console.log(`${from} 님과 ${to}님의 모든 대화 내용`);

			// 존재하는 유저인지 파악
			Promise.all([User.findOne({ id: from }), User.findOne({ id: to })]).then((users) => {
				const [fromUser, toUser] = users;
				if (fromUser.length !== 0 && toUser.length !== 0) {
					// 존재하는 유저라면
					Promise.all([
						PrivateMessage.find({ sender: fromUser._id, receiver: toUser._id }),
						PrivateMessage.find({ sender: toUser._id, receiver: fromUser._id }),
					]).then((messages) => {
						
						const [fromMsg, toMsg] = messages;
						const message = [...fromMsg, ...toMsg];
						const dateSort = (a, b) => {
							if (a.createdAt == b.createdAt) {
								return 0;
							}
							return a.createdAt <= b.createdAt ? -1 : 1;
						};
						message.sort(dateSort);
						io.to(socket.id).emit('private get message', message);
					});
				} else {
					console.log('존재하지 않는 유저입니다.');
				}
			});
		});

		// 연결 끊겼을때
		socket.on('disconnect', () => {
			getClientList();
		});
	});
};