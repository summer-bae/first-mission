import React, { Component, useState } from 'react';
import style from './chatlist.css';

export default function ChatList(props) {
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		allMessage: props.allMessage,
	// 		username: props.username,
	// 		message: props.message,
	// 		type: props.type,
	// 	};
	// }

	const [allMessage, setAllMessage] = useState(props.allMessage);
	const [username, setUsername] = useState(props.username);
	const [message, setMessage] = useState(props.message);
	const [type, setType] = useState(props.type);

	// static getDerivedStateFromProps(nextProps, prevState) {
	// 	// 메시지 변경되었을떄
	// 	if (nextProps.allMessage !== prevState.allMessage) {
	// 		console.log(prevState.type);
	// 		return {
	// 			allMessage: nextProps.allMessage,
	// 		};
	// 	}

	// 	// 메시지 변경되었을떄
	// 	if (nextProps.message !== prevState.message) {
	// 		return {
	// 			message: nextProps.message,
	// 		};
	// 	}

	// 	if (nextProps.username !== prevState.username) {
	// 		return {
	// 			username: nextProps.username,
	// 		};
	// 	}

	// 	if (nextProps.type !== prevState.type) {
	// 		return {
	// 			type: nextProps.type,
	// 		};
	// 	}

	// 	return null;
	// 

	function makePublicChatList(list) {
		if (list) {
			return list.map((item) => {
				return distinctMsg(item);
			});
		}
	}

	function distinctMsg(item) {
		const { _id, username, message, createdAt } = item;
		console.log(item);

		if (item.username !== username) {
			// 내가 보낸 것이 아니라면
			return (
				<div className="incoming_msg chat_content" key={_id}>
					<div className={style.received_msg}>
						<div className={style.received_withd_msg}>
							<strong>{item.username}</strong>
							<p>{item.message}</p>
							<span style={{ color: '#cccccc', fontSize: 'x-small' }}>
								{item.createdAt}
							</span>
						</div>
					</div>
				</div>
			);
		} else {
			// 내가 보낸 것이라면
			return (
				<div className="outgoing_msg chat_content" key={_id}>
					<div className={style.sent_msg}>
						<p>{item.message}</p>
						<span style={{ color: '#cccccc', fontSize: 'x-small' }}>
							{item.createdAt}
						</span>
					</div>
				</div>
			);
		}
	}

	if (this.state.type === 'public') {
		return (
			<div id={style.chat_ul}>{allMessage ? this.makePublicChatList(allMessage) : ''}</div>
		);
	} else {
		return (
			<div id={style.chat_ul}>{message ? this.makePublicChatList(message) : ''}</div>
		);
	}
}