"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const account_1 = __importDefault(require("../../models/account/account"));
const publicRoom_1 = __importDefault(require("../../models/chat/publicRoom"));
const privateMessage_1 = __importDefault(require("../../models/chat/privateMessage"));
const publicMessage_1 = __importDefault(require("../../models/chat/publicMessage"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.tz.setDefault('Asia/Seoul');
module.exports = (server) => {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log('new connection', socket.id);
        socket.on('enter public room', (username) => {
            account_1.default.findOne({ id: username }, (err, user) => {
                if (err)
                    throw err;
                if (!user) {
                    console.log('존재하는 유저가 아닙니다.');
                }
                else {
                    publicRoom_1.default.findOne({ username: username }, (err, participant) => {
                        if (err)
                            throw err;
                        if (!participant) {
                            // 참여자 정보가 없다면 publicRoom에 참여자로 저장
                            console.log('no part');
                            const publicRoom = new publicRoom_1.default({
                                username: username,
                                socketId: socket.id,
                                userId: user._id,
                                createdAt: (0, moment_timezone_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                            });
                            publicRoom.save((err) => {
                                if (err)
                                    throw err;
                                // 참여자로 저장이 됐다면
                                io.emit('success public room');
                            });
                        }
                        else {
                            // 이력만 남아있거나 페이지 새로고침 했을 경우
                            // 이후 동일하게 새롭게 로그인한 socket에 id를 저장하고 알림
                            console.log('par');
                            participant.socketId = socket.id;
                            participant.createdAt = (0, moment_timezone_1.default)().format('YYYY-MM-DD HH:mm:ss');
                            participant.save((err) => {
                                if (err)
                                    throw err;
                                io.emit('success public room');
                            });
                        }
                    });
                }
            });
        });
        // 전체 유저 리스트
        function getClientList() {
            publicRoom_1.default.find({}).exec((err, user) => {
                if (err)
                    throw err;
                io.emit('success get users', user);
            });
        }
        // 참여자 목록
        socket.on('get all users', () => {
            getClientList();
        });
        // 클라이언트에게 전체 메시지를 받으면
        socket.on('public send message', (username, msg) => {
            console.log(username, msg);
            account_1.default.findOne({ id: username }, (err, user) => {
                if (err)
                    throw err;
                else {
                    publicRoom_1.default.findOne({ username: username }, (err, participant) => {
                        if (err)
                            throw err;
                        else {
                            // 전체 채팅 내용 저장
                            const publicMessage = new publicMessage_1.default({
                                sender: user._id,
                                username: username,
                                message: msg,
                                createdAt: (0, moment_timezone_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                            });
                            publicMessage.save((err) => {
                                if (err)
                                    throw err;
                                else {
                                    console.log('public send message!', msg);
                                    // 채팅 내용이 저장 됐다면
                                    publicRoom_1.default.findOne({ username: username }, (err, user) => {
                                        if (err)
                                            throw err;
                                        else {
                                            publicMessage_1.default.find({})
                                                .sort({
                                                createdAt: 'asc',
                                            })
                                                .exec((err, messages) => {
                                                if (err)
                                                    throw err;
                                                // 요청한 클라이언트에게 전달 채팅 내역 전달
                                                io.to(socket.id).emit('public all message', messages);
                                                io.emit('public all message', messages);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
        // 전체 채팅 내용
        socket.on('get public message', (username) => {
            console.log('get public message!', username);
            // 요청한 사용자의 socket id검색
            publicRoom_1.default.findOne({ username: username }, (err, user) => {
                if (err)
                    throw err;
                else {
                    publicMessage_1.default.find({})
                        .sort({ createdAt: 'asc' })
                        .exec((err, messages) => {
                        if (err)
                            throw err;
                        // 요청한 클라이언트에게 전달 채팅 내역 전달
                        io.to(socket.id).emit('public all message', messages);
                        io.emit('public all message', messages);
                    });
                }
            });
        });
        // 귓속말 채팅 보내기
        socket.on('private send message', (from, to, msg) => {
            // 두 유저가 존재하는 유저인지 확인
            Promise.all([
                account_1.default.findOne({ id: from }),
                account_1.default.findOne({ id: to }),
            ])
                .then((users) => {
                const [fromUser, toUser] = users;
                if (fromUser !== null && toUser !== 0) {
                    //두 유저가 존재한다면
                    const privateMessage = new privateMessage_1.default({
                        sender: fromUser._id,
                        username: from,
                        message: msg,
                        receiver: toUser._id,
                        receiverName: to,
                        createdAt: (0, moment_timezone_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    });
                    // 귓속말 저장
                    privateMessage.save((err) => {
                        if (err)
                            throw err;
                        else {
                            // 저장이 완료되면 귓속말 보내기
                            console.log('send private!');
                            Promise.all([
                                account_1.default.findOne({ id: from }),
                                account_1.default.findOne({ id: to }),
                            ]).then((users) => {
                                const [fromUser, toUser] = users;
                                if (fromUser !== null &&
                                    toUser !== null) {
                                    // 존재하는 유저라면
                                    Promise.all([
                                        privateMessage_1.default.find({
                                            sender: fromUser._id,
                                            receiver: toUser._id,
                                        }),
                                        privateMessage_1.default.find({
                                            sender: toUser._id,
                                            receiver: fromUser._id,
                                        }),
                                    ]).then((messages) => {
                                        const [fromMsg, toMsg] = messages;
                                        const message = [
                                            ...fromMsg,
                                            ...toMsg,
                                        ];
                                        const dateSort = (a, b) => {
                                            if (a.createdAt ==
                                                b.createdAt) {
                                                return 0;
                                            }
                                            return a.createdAt <=
                                                b.createdAt
                                                ? -1
                                                : 1;
                                        };
                                        message.sort(dateSort);
                                        io.to(socket.id).emit('private get message', message);
                                        io.emit('private get message', message);
                                    });
                                }
                                else {
                                    console.log('존재하지 않는 유저입니다.');
                                }
                            });
                        }
                    });
                }
                else {
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
            console.log('get private!');
            // 존재하는 유저인지 파악
            Promise.all([
                account_1.default.findOne({ id: from }),
                account_1.default.findOne({ id: to }),
            ]).then((users) => {
                const [fromUser, toUser] = users;
                if (fromUser !== null && toUser !== null) {
                    // 존재하는 유저라면
                    Promise.all([
                        privateMessage_1.default.find({
                            sender: fromUser._id,
                            receiver: toUser._id,
                        }),
                        privateMessage_1.default.find({
                            sender: toUser._id,
                            receiver: fromUser._id,
                        }),
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
                        // io.emit('private get message', message);
                    });
                }
                else {
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
