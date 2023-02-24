import React from 'react';
import axios from 'axios';

import Header from '../containers/Header';
import MessageBox from '../containers/MessageBox';
import io from "socket.io-client";

const socket = io.connect("", {
	path: '/socket.io',
	transports: ['websocket'],
});

class Chat extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: '',
			toUser: '',
			toSocketId: '',
			isWhisper: false,
			message: '',
			logs: [],
			currentUserList: []
		}
	}
	
	sendChat = () => {
		const nowState = {
			user: this.state.user,
			isWhisper: this.state.isWhisper,
			message: this.state.message,
		};
		
		if (this.state.isWhisper) {
			nowState.toUser = this.state.toUser
		}
		
		axios.post('/chat', nowState).then(() => {
			if (this.state.isWhisper) {
				nowState.toSocketId = this.state.toSocketId;
			}
			
			socket.emit('toMessage', nowState);
			
			this.setState({
				toUser: '',
				isWhisper: false,
				message: '',
				toSocketId: ''
			});
		}).catch((error) => {
			console.error(error);
		});
	}
	
	
	render() {
		const allChats = this.state.logs.map((chat, idx) => {
			<MessageBox 
				user = {this.state.user}
				message = {chat.message}
				isWhisper = {chat.isWhisper}
				toUser = {chat.toUser}
				key = {idx}
			/>
		});
		
		<div className = "Chat">
			<div className = "chat-board">
				{allChats}
			</div>
		</div>
		
	}
}

export default Chat;