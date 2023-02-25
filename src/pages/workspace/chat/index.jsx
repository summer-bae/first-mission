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
			userId: '',
			toUserId: '',
			isWhisper: false,
			message: '',
			allChats: [],
			currentUserList: []
		}
	}
	
	sendChat = () => {
		const nowState = {
			userId: this.state.userId,
			isWhisper: this.state.isWhisper,
			message: this.state.message,
		};
		
		if (this.state.isWhisper) {
			nowState.toUser = this.state.toUser
		}
		
		axios.post('/api/chat/chat', nowState).then(() => {
			socket.emit('toMessage', nowState);
			
			this.setState({
				toUser: '',
				isWhisper: false,
				message: '',
			});
		}).catch((error) => {
			console.error(error);
		});
	}
	
	mount = () => {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				userId: data
			})
			
			axios.get('/api/chat/all-chats?id=${this.state.userId}').then(({ data }) => {
				this.setState({
					allChats: data
				})
			})
			
			// currentUserList에 담기
			socket.emit('joinChat', ({
				id: this.state.userId,
			}))
		});
		
		// 유저 리스트 받기
		socket.on('getUserList', (arr) => {
			this.setState({ 
				currentUserList: arr 
			})
		})
		
		// 귓속말로 온 채팅 메시지 받기
		socket.on('fromMessage', (obj) => {
			const temp = this.state.allChats;
			temp.push(obj);
			
			this.setState({
				allChats: temp
			})
		})
	}
	
	changeMessage = (e) => {
		this.setState({
			message: e.target.value
		})
	}
	
	submit = (e) => {
		if (e.key == 'Enter') {
			sendChat();
		}
	}
	
	changeToUser = (e) => {
		if (this.state.userId === e.target.value) {
			alert('자신한테 메시지 보낼 수 없음');
			e.target.value = 'default';
			return
		}
		
		if (e.target.value !== 'default') {
			const idx = e.target.value;
			
			this.setState({
				isWhisper: true,
				toUser: e.target.value,
			})
		} else {
			this.setState({
				isWhisper: false,
				idx: 0
			})
		}
	}
	
	
	render() {
		const allChats = this.state.allChats.map((chat, idx) => {
			<MessageBox 
				userId = {this.state.userId}
				message = {chat.message}
				isWhisper = {chat.isWhisper}
				toUser = {chat.toUser}
				key = {idx}
			/>
		});
		
		
		return (
			<div>
				<Header />
				<div className = "Chat">
					<div className = "chat-board">
						{ allChats }
					</div>
					<div className = "chat-input">

						<input 
							type = "text"
							className = "message-form"
							placeholder = "전송할 메시지를 적으세요"
							value = { this.state.message }
							onChange = { this.changeMessage }
							onKeyPress = { this.submit }
						/>
						<button
							className = "submit-btn"
							type = "button"
							id = "button-add"
							onClick = { this.sendChat }
						>전송</button>
					</div>
				</div>
			</div>
		)
		
	}
}

export default Chat;