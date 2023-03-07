import React, { useState, useMemo } from 'react';
import { Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

type TypingProps = {
	socket: any;
	username: string;
	allUsers: Array<any>;
};

function Typing(props: TypingProps) {
	const [socket, setSocket] = useState(props.socket);
	const [username, setUsername] = useState(props.username);
	const [allUsers, setAllUsers] = useState(props.allUsers);
	const [message, setMessage] = useState('');

	useMemo(() => {
		if (props.allUsers) {
			setAllUsers(props.allUsers);
		}
	}, [props.allUsers]);

	useMemo(() => {
		setSocket(props.socket);
	}, [props.socket]);

	useMemo(() => {
		if (props.username) {
			setUsername(props.username);
		}
	}, [props.username]);

	// 메시지 input값 변경
	function messageChangeHandler(e) {
		const value = e.target.value;
		setMessage(value);
	}

	function massageSendHandler() {
		if (message.length > 0) {
			const from = username;
			const to = document.getElementsByClassName('list-group-item active')[0].id;
			const msg = message;

			if (to === 'public') {
				// 전체 채팅 전송
				socket.emit('public send message', from, msg);
			} else {
				// 귓속말 전송
				socket.emit('private send message', from, to, msg);
			}

			setMessage('');
		} else {
			alert('메시지를 입력해주세요');
		}
	}

	// 키이벤트
	function keyPressHandler(e) {
		if (e.key === 'Enter') {
			if (e.nativeEvent.isComposing === false) {
				massageSendHandler();
			}
		}
	}

	return (
		<Col>
			<InputGroup>
				<InputGroupAddon addonType="prepend">{allUsers}</InputGroupAddon>
				<Input
					placeholder="메시지를 입력하세요"
					onChange={messageChangeHandler}
					value={message}
					onKeyDown={keyPressHandler}
				/>
				<Button onClick={massageSendHandler}>전송</Button>
			</InputGroup>
		</Col>
	);
}

export default Typing;