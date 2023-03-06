import React, { Component } from 'react';
import { Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

export default class Typing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			socket: props.socket,
			username: props.username,
			allUsers: props.allUsers,
			message: '',
		};
	}
	

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.socket !== prevState.socket) {
			return {
				socket: nextProps.socket,
			};
		}

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
		
		

		return null;
	}

	// 메시지 input값 변경
	messageChangeHandler = (e) => {
		const value = e.target.value;
		this.setState({
			message: value,
		});
	};

	massageSendHandler = () => {
		if (this.state.message.length > 0) {
			const from = this.props.username;
			const to = document.getElementsByClassName('list-group-item active')[0].id;
			const msg = this.state.message;

			if (to === 'public') {
				// 전체 채팅 전송
				this.state.socket.emit('public send message', from, msg);
	
			} else {
				// 귓속말 전송
				this.state.socket.emit('private send message', from, to, msg);
			}

			this.setState({
				message: '',
			});
		} else {
			alert('메시지를 입력해주세요');
		}
	};

	// 키이벤트
	keyPressHandler = (e) => {
		if (e.key === 'Enter') {
			if (e.nativeEvent.isComposing === false) {
				this.massageSendHandler();
			}
		}
	};

	render() {
		const allUsers = this.state.allUsers;
		const message = this.state.message;

		return (
			<Col>
				<InputGroup>
					<InputGroupAddon addonType="prepend">{allUsers}</InputGroupAddon>
					<Input
						placeholder="메시지를 입력하세요"
						onChange={this.messageChangeHandler}
						value={message}
						onKeyDown={this.keyPressHandler}
					/>
					<Button onClick={this.massageSendHandler}>전송</Button>
				</InputGroup>
			</Col>
		);
	}
}