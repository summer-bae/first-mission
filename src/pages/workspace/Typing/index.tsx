import React, { useState, useMemo } from 'react';
import { Col, InputGroup, Input, Button } from 'reactstrap';
import { Socket } from 'socket.io-client';

type FromChatProps = {
	socket: Socket;
	username: string;
	activeUserList: string;
};

function Typing(props: FromChatProps) {
	const [socket, setSocket] = useState<Socket>(props.socket);
	const [username, setUsername] = useState<string>(props.username);
	const [message, setMessage] = useState<string>('');

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