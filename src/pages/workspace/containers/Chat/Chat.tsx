import React, { Component, useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Typing from '../Typing';
import UserList from '../UserList';
import ChatList from '../ChatList';
import axios from 'axios';
import style from './chat.module.css';

type ChatProps = {
	socket: any;
	username: string;
	allUsers: Array<any> | null;
	allMessage: Array<any> | null;
	message: Array<any> | null;
};

function Chat(props: ChatProps) {
	const [socket, setSocket] = useState(props.socket);
	const [username, setUsername] = useState(props.username);
	const [allUsers, setAllUsers] = useState(props.allUsers);
	const [allMessage, setAllMessage] = useState(props.allMessage);
	const [message, setMessage] = useState(props.message);
	const [activeUserList, setActiveUserList] = useState<string>('public');

	// 마지막 메시지 스크롤 포커스
	function lastLineFocus() {
		const lists = document.getElementsByClassName('chat_content');
		if (lists.length > 0) {
			lists[lists.length - 1].scrollIntoView();
		}
	}

	useEffect(() => {
		axios.get('/api/account/id').then(({ data }) => {
			setUsername(data);

			socket.emit('enter public room', data);
			socket.on('success public room', () => {
				socket.emit('get all users');
			});

			socket.emit('get public message', data);
		});

		lastLineFocus();
	}, []);

	useEffect(() => {
		socket.on('public all message', (obj) => {
			setAllMessage(obj);
		});

		lastLineFocus();
	}, [allMessage]);

	useEffect(() => {
		socket.on('private get message', (obj) => {
			setMessage(obj);
		});

		lastLineFocus();
	}, [message]);

	useEffect(() => {
		socket.on('success get users', (allUsers) => {
			setAllUsers(allUsers);
		});
	}, [allUsers]);

	function receiveActiveUser(activeUser : string):void {
		setActiveUserList(activeUser);
	}

	return (
		<Container>
			<Row id={style.chat_wrapper}>
				<Col md="4" sm="4" xs="12" id="user_list_wrapper">
					<UserList
						allUsers={allUsers}
						username={username}
						socket={socket}
						receiveActiveUser={receiveActiveUser}
					/>
				</Col>

				<Col md="8" sm="8" xs="12" id={style.chat_list_wrapper}>
					<Row>
						<ChatList
							allMessage={allMessage}
							username={username}
							message={message}
							type={activeUserList}
						/>
					</Row>
					<Row>
						<Typing
							socket={socket}
							activeUserList={activeUserList}
							allUsers={allUsers}
							username={username}
						/>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}

export default Chat;