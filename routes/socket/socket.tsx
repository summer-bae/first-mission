import { publicMessageType } from '@models/chat/publicMessage';
import { publicRoomType } from '@models/chat/publicRoom';

import { Server, ServerOptions, Handshake } from 'socket.io';
import User from '../../models/account/account';
import PublicRoom from '../../models/chat/publicRoom';
import PrivateMessage from '../../models/chat/privateMessage';
import PublicMessage from '../../models/chat/publicMessage';
import moment from 'moment-timezone';
// import session from 'express-session';

const sharedSession = require('express-socket.io-session');

moment.tz.setDefault('Asia/Seoul');

interface CustomHandshake extends Handshake {
	session: any;
}

module.exports = (server, useSession, redisClient) => {
	const io = new Server(server);
	io.use(sharedSession(useSession(redisClient)));

	io.on('connection', (socket) => {
		const customHandshake = socket.handshake as unknown as CustomHandshake;
		console.log(customHandshake.session);
		console.log('new connection', socket.id);

		socket.on('enter public room', () => {
			User.findOne(
				{ id: customHandshake.session.user.id },
				(err: any, user: { _id: any }) => {
					if (err) throw err;
					if (!user) {
						console.log('존재하는 유저가 아닙니다.');
					} else {
						PublicRoom.findOne(
							{ username: customHandshake.session.user.id },
							(
								err: any,
								participant: {
									socketId: string;
									createdAt: string;
									save: (arg0: (err: any) => void) => void;
								},
							) => {
								if (err) throw err;
								if (!participant) {
									// 참여자 정보가 없다면 publicRoom에 참여자로 저장
									console.log('no part');
									const publicRoom = new PublicRoom({
										username:
											customHandshake.session.user.id,
										socketId: socket.id,
										userId: user._id,
										createdAt: moment().format(
											'YYYY-MM-DD HH:mm:ss',
										),
									});
									publicRoom.save((err: any) => {
										if (err) throw err;
										// 참여자로 저장이 됐다면
										io.emit('success public room');
									});
								} else {
									// 이력만 남아있거나 페이지 새로고침 했을 경우
									// 이후 동일하게 새롭게 로그인한 socket에 id를 저장하고 알림
									console.log('par');
									participant.socketId = socket.id;
									participant.createdAt = moment().format(
										'YYYY-MM-DD HH:mm:ss',
									);
									participant.save((err: any) => {
										if (err) throw err;
										io.emit('success public room');
									});
								}
							},
						);
					}
				},
			);
		});

		socket.on('join', (roomId) => {
			socket.join(roomId);
			for (let id of socket.rooms) {
				if (id !== socket.id && id !== roomId) {
					console.log('SOCKET LEAVE', id);
					socket.leave(id);
				}
			}
		});

		// 전체 유저 리스트
		function getClientList() {
			PublicRoom.find({}).exec(
				(err: any, user: Array<publicRoomType>) => {
					if (err) throw err;
					io.emit('success get users', user);
				},
			);
		}

		// 참여자 목록
		socket.on('get all users', () => {
			getClientList();
		});

		// 클라이언트에게 전체 메시지를 받으면
		socket.on('public send message', (msg: string) => {
			console.log(customHandshake.session.user.id, msg);
			User.findOne(
				{ id: customHandshake.session.user.id },
				(err: any, user: { _id: any }) => {
					if (err) throw err;
					else {
						PublicRoom.findOne(
							{ username: customHandshake.session.user.id },
							(err: any, participant: publicRoomType) => {
								if (err) throw err;
								else {
									// 전체 채팅 내용 저장
									const publicMessage = new PublicMessage({
										sender: user._id,
										username:
											customHandshake.session.user.id,
										message: msg,
										createdAt: moment().format(
											'YYYY-MM-DD HH:mm:ss',
										),
									});

									publicMessage.save((err: any) => {
										if (err) throw err;
										else {
											console.log(
												'public send message!',
												msg,
											);
											// 채팅 내용이 저장 됐다면
											PublicRoom.findOne(
												{
													username:
														customHandshake.session
															.user.id,
												},
												(
													err: any,
													user: publicRoomType,
												) => {
													if (err) throw err;
													else {
														PublicMessage.find({})
															.sort({
																createdAt:
																	'asc',
															})
															.exec(
																(
																	err: any,
																	messages: publicMessageType,
																) => {
																	if (err)
																		throw err;
																	// 요청한 클라이언트에게 전달 채팅 내역 전달
																	io.to(
																		socket.id,
																	).emit(
																		'public all message',
																		messages,
																	);
																	io.emit(
																		'public all message',
																		messages,
																	);
																},
															);
													}
												},
											);
										}
									});
								}
							},
						);
					}
				},
			);
		});

		// 전체 채팅 내용
		socket.on('get public message', () => {
			console.log('get public message!', customHandshake.session.user.id);
			// 요청한 사용자의 socket id검색
			PublicRoom.findOne(
				{ username: customHandshake.session.user.id },
				(err: any, user: publicRoomType) => {
					if (err) throw err;
					else {
						PublicMessage.find({})
							.sort({ createdAt: 'asc' })
							.exec((err: any, messages: publicMessageType) => {
								if (err) throw err;
								// 요청한 클라이언트에게 전달 채팅 내역 전달
								io.to(socket.id).emit(
									'public all message',
									messages,
								);
								io.emit('public all message', messages);
							});
					}
				},
			);
		});

		// 귓속말 채팅 보내기
		socket.on('private send message', (to: string, msg: string) => {
			// 두 유저가 존재하는 유저인지 확인
			Promise.all([
				User.findOne({ id: customHandshake.session.user.id }),
				User.findOne({ id: to }),
			])
				.then((users) => {
					const [fromUser, toUser] = users;
					if (fromUser !== null && toUser !== 0) {
						//두 유저가 존재한다면
						const privateMessage = new PrivateMessage({
							sender: fromUser._id,
							username: customHandshake.session.user.id,
							message: msg,
							receiver: toUser._id,
							receiverName: to,
							createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
						});
						// 귓속말 저장
						privateMessage.save((err: any) => {
							if (err) throw err;
							else {
								// 저장이 완료되면 귓속말 보내기
								console.log('send private!');
								Promise.all([
									User.findOne({
										id: customHandshake.session.user.id,
									}),
									User.findOne({ id: to }),
								]).then((users) => {
									const [fromUser, toUser] = users;
									if (fromUser !== null && toUser !== null) {
										// 존재하는 유저라면
										Promise.all([
											PrivateMessage.find({
												sender: fromUser._id,
												receiver: toUser._id,
											}),
											PrivateMessage.find({
												sender: toUser._id,
												receiver: fromUser._id,
											}),
										]).then((messages) => {
											const [fromMsg, toMsg] = messages;
											const message = [
												...fromMsg,
												...toMsg,
											];
											const dateSort = (
												a: { createdAt: String },
												b: { createdAt: String },
											) => {
												if (
													a.createdAt == b.createdAt
												) {
													return 0;
												}
												return a.createdAt <=
													b.createdAt
													? -1
													: 1;
											};
											message.sort(dateSort);
											if (
												customHandshake.session.user
													.id <= to
											) {
												io.to(
													customHandshake.session.user
														.id + to,
												).emit(
													'private get message',
													message,
												);
											} else {
												io.to(
													to +
														customHandshake.session
															.user.id,
												).emit(
													'private get message',
													message,
												);
											}
										});
									} else {
										console.log(
											'존재하지 않는 유저입니다.',
										);
									}
								});
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
		socket.on('get private message', (to: string) => {
			console.log('get private!');
			// 존재하는 유저인지 파악
			Promise.all([
				User.findOne({ id: customHandshake.session.user.id }),
				User.findOne({ id: to }),
			]).then((users) => {
				const [fromUser, toUser] = users;
				if (fromUser !== null && toUser !== null) {
					// 존재하는 유저라면
					Promise.all([
						PrivateMessage.find({
							sender: fromUser._id,
							receiver: toUser._id,
						}),
						PrivateMessage.find({
							sender: toUser._id,
							receiver: fromUser._id,
						}),
					]).then((messages) => {
						const [fromMsg, toMsg] = messages;
						const message = [...fromMsg, ...toMsg];
						const dateSort = (
							a: { createdAt: String },
							b: { createdAt: String },
						) => {
							if (a.createdAt == b.createdAt) {
								return 0;
							}
							return a.createdAt <= b.createdAt ? -1 : 1;
						};
						message.sort(dateSort);
						if (customHandshake.session.user.id <= to) {
							io.to(customHandshake.session.user.id + to).emit(
								'private get message',
								message,
							);
						} else {
							io.to(to + customHandshake.session.user.id).emit(
								'private get message',
								message,
							);
						}
					});
				} else {
					console.log('존재하지 않는 유저입니다.');
				}
			});
		});

		// 연결 끊겼을때
		socket.on('disconnect', () => {
			console.log('disconnect');
		});
	});
};
