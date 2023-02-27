import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

import style from './style.scss';
import io from 'socket.io-client';

const socket = io.connect('', {
	path: '/socket.io',
	transports: ['websocket'],
});

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			socket: null,
			allUsers: null,
			publicMessage: null,
			allMessage: null,
			privateMessage: null,
			message: null,
		};
	}

	componentDidMount() {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				username: data,
			});

			console.log(socket, socket.id);

			socket.emit('enter public room', data);
			socket.on('success public room', () => {
				socket.emit('get all users');
			});

			socket.on('success get users', (allUsers) => {
				this.setState({
					allUsers: allUsers,
					socket: socket,
				});
			});

			socket.on('public message', (publicMessage) => {
				this.setState({
					publicMessage: publicMessage,
				});
			});

			socket.on('public all message', (allMessage) => {
				this.setState({
					allMessage: allMessage,
				});
			});

			socket.on('private message', (privateMessage) => {
				this.setState({ privateMessage: privateMessage });
			});

			socket.on('private get message', (message) => {
				this.setState({
					message: message,
				});
			});
		});
	}

	authenticatedHandler(username) {
		const socket = socketIOClient('https://mission-ink-czzqf.run.goorm.site/socket.io');

		socket.emit('enter public room', username);
		socket.on('success public room', () => {
			socket.emit('get all users');
		});

		socket.on('success get users', (allUsers) => {
			this.setState({
				allUsers: allUsers,
				socket: socket,
			});
		});

		socket.on('public message', (publicMessage) => {
			this.setState({
				publicMessage: publicMessage,
			});
		});

		socket.on('public all message', (allMessage) => {
			this.setState({
				allMessage: allMessage,
			});
		});

		socket.on('private message', (privateMessage) => {
			this.setState({ privateMessage: privateMessage });
		});

		socket.on('private get message', (message) => {
			this.setState({
				message: message,
			});
		});
	}

	signOut = () => {
		window.location.href = '/api/account/signout';
		console.log(this.state);
	};

	render() {
		console.log(this.state);
		const { username } = this.state;
		return (
			<div className={style.Header}>
				<UncontrolledDropdown>
					<DropdownToggle caret tag="a" className={style.Header__dropdown}>
						{username}
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem onClick={this.signOut}>로그아웃</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</div>
		);
	}
}

export default Header;