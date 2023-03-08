import React, { useState, useEffect } from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

import style from './style.scss';
import io from 'socket.io-client';

import Chat from '../Chat/Chat.tsx';

const newSocket = io.connect('', {
	path: '/socket.io',
	transports: ['websocket'],
});

function Header() {

	const [socket, setSocket] = useState<any>(newSocket);
	const [username, setUsername] = useState<string>('');
	const [allUsers, setAllUsers] = useState<Array<any> | null>(null);
	const [allMessage, setAllMessage] = useState<Array<any> | null>(null);
	const [message, setMessage] = useState<Array<any> | null>(null);

	useEffect(() => {
		axios.get('/api/account/id').then(({ data }) => {
			setUsername(data);

			socket.emit('enter public room', data);
			socket.on('success public room', () => {
				socket.emit('get all users');
			});

			socket.on('success get users', (allUsers) => {
				setAllUsers(allUsers);
			});

			socket.on('public all message', (allMessage) => {
				setAllMessage(allMessage);
			});

			socket.on('private get message', (message) => {
				setMessage(message);
			});
		});
	}, []);

	function signOut() {
		window.location.href = '/api/account/signout';
	}

	return (
		<>
			<div className={style.Header}>
				<UncontrolledDropdown>
					<DropdownToggle caret tag="a" className={style.Header__dropdown}>
						{username}
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem onClick={signOut}>로그아웃</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</div>
			<Chat
				socket={socket}
				username={username}
				allUsers={allUsers}
				allMessage={allMessage}
				message={message}
			/>
			<hr />
		</>
	);
}

export default Header;