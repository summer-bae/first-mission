import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

import style from './style.scss';
import io from 'socket.io-client';

import Chat from '../Chat/Chat';

const socket = io.connect('', {
	path: '/socket.io',
	transports: ['websocket'],
});

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			socket: socket,
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

			socket.emit('enter public room', data);
			socket.on('success public room', () => {
				socket.emit('get all users');
			});

			socket.on('success get users', (allUsers) => {
				this.setState({
					allUsers: allUsers,
				});
			});

			socket.on('public all message', (allMessage) => {
				this.setState({
					allMessage: allMessage,
				});
			});

			socket.on('private get message', (message) => {
				this.setState({
					message: message,
				});
			});
		});
	}
	

	componentDidUpdate(prevProps, prevState) {
		const {
			allUsers: prevAllUsers,
			username: prevUsername,
			socket: prevSocket,
			publicMessage: prevPublicMessage,
			allMessage: prevAllMessage,
			privateMessage: prevPrivateMessage,
			message: prevMessage,
		} = prevProps;
		const {
			allUsers,
			username,
			socket,
			publicMessage,
			allMessage,
			privateMessage,
			message,
		} = this.props;

		if (prevAllUsers !== allUsers) {
			this.setState({ allUsers: allUsers });
		}
		if (prevUsername !== username) {
			this.setState({ username: username });
		}
		if (prevSocket !== socket) {
			this.setState({ socket: socket });
		}
		if (prevPublicMessage !== publicMessage) {
			this.setState({ publicMessage: publicMessage });
		}
		if (prevAllMessage !== allMessage) {
			this.setState({ allMessage: allMessage });
		}
		if (prevPrivateMessage !== privateMessage) {
			this.setState({ privateMessage: privateMessage });
		}
		if (prevMessage !== message) {
			this.setState({ message: message });
		}
	}

	signOut = () => {
		window.location.href = '/api/account/signout';
	};

	render() {
		const { username } = this.state;

		return (
			<>
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
				<Chat
					socket={this.state.socket}
					username={this.state.username}
					allUsers={this.state.allUsers}
					publicMessage={this.state.publicMessage}
					allMessage={this.state.allMessage}
					privateMessage={this.state.privateMessage}
					message={this.state.message}
				/>
				<hr />
			</>
		);
	}
}

export default Header;