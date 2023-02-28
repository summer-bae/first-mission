import React, { Component, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Typing from '../containers/typing';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import Header from '../containers/Header';
import UserList from '../containers/UserList';
import ChatList from '../containers/ChatList';
import axios from 'axios';

const socket = io.connect('', {
	path: '/socket.io',
	transports: ['websocket'],
});

export default class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			socket: props.socket,
			username: props.username,
			allUsers: props.allUsers,
			publicMessage: props.publicMessage,
			allMessage: props.allMessage,
			privateMessage: props.privateMessage,
			message: props.message,
			activeUserList: 'public',
		};
	}

	componentDidMount() {
		socket.on('public message', (obj) => {
			const temp = this.state.allMessage;
			temp.push(obj);
			
			this.setState({
				allMessage: temp
			})
		})
		
		socket.on('private message', (obj) => {
			const temp = this.state.message;
			temp.push(obj);
			
			this.setState({
				message: temp
			})
		})
		
	}

	componentDidUpdate(prevProps, prevState) {
		this.lastLineFocus();
	}

	// 마지막 메시지 스크롤 포커스
	lastLineFocus = () => {
		const lists = document.getElementsByClassName('chat_content');
		if (lists.length > 0) {
			lists[lists.length - 1].scrollIntoView();
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		// 유저리스트 비교
		if (nextProps.allUsers !== prevState.allUsers) {            
			return {
				allUsers: nextProps.allUsers,
			};
		}

		if (nextProps.username !== prevState.username) {
			return {
				username: nextProps.username,
			};
		}
		
		if (nextProps.publicMessage !== prevState.publicMessage) {
			return {
				publicMessage: nextProps.publicMessage,
			}
		}
		
		if (nextProps.allMessage !== prevState.allMessage) {
			return {
				allMessage: nextProps.allMessage,
			}
		}
		
		if (nextProps.privateMessage !== prevState.privateMessage) {
			return {
				privateMessage: nextProps.privateMessage,
			}
		}
		
		if (nextProps.message !== prevState.message) {
			return {
				message: nextProps.message,
			}
		}


		return null;
	}

	receiveActiveUser = activeUser => {
		this.setState({
			activeUserList: activeUser,
		});
	};

	render() {
		
		const allMessage = this.state.allMessage;
		const message = this.state.message;
		const allUsers = this.state.allUsers;
		const username = this.state.username;
		const socket = this.state.socket;
		const activeUserList = this.state.activeUserList;

		return (
			<Container>
				<Row id="chat_wrapper">
					<Col md="4" sm="4" xs="12" id="user_list_wrapper">
						<UserList
							allUsers={allUsers}
							username={username}
							socket={socket}
							receiveActiveUser={this.receiveActiveUser}
						/>
					</Col>

					<Col md="8" sm="8" xs="12" id="chat_list_wrapper">
						<Row>
							<ChatList allMessage={allMessage} username={username} message={message} type={activeUserList}/>
						</Row>
						<Row>
							<Typing
								socket={socket}
								username={username}
								activeUserList={activeUserList}
							/>
						</Row>
					</Col>
				</Row>
			</Container>
		);
	}
}