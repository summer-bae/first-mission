import React, { Component } from 'react';
import style from './chatlist.css';

export default class ChatList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allMessage: props.allMessage,
			username: props.username,
			message: props.message,
			type: props.type,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// 메시지 변경되었을떄
		if (nextProps.allMessage !== prevState.allMessage) {
			console.log(prevState.type);
			return {
				allMessage: nextProps.allMessage,
			};
		}

		// 메시지 변경되었을떄
		if (nextProps.message !== prevState.message) {
			return {
				message: nextProps.message,
			};
		}

		if (nextProps.username !== prevState.username) {
			return {
				username: nextProps.username,
			};
		}

		if (nextProps.type !== prevState.type) {
			return {
				type: nextProps.type,
			};
		}

		return null;
	}

	makePublicChatList = (list) => {
		if (list) {
			return list.map((item) => {
				return this.distinctMsg(item);
			});
		}
	};

	distinctMsg = (item) => {
		const { _id, username, message, createdAt } = item;

		if (username !== this.state.username) {
			// 내가 보낸 것이 아니라면
			return (
				<div className="incoming_msg chat_content" key={_id}>
					<div className={style.received_msg}>
						<div className={style.received_withd_msg}>
							<strong>{username}</strong>
							<p>{message}</p>
							<span style={{ color: '#cccccc', fontSize: 'x-small' }}>
								{createdAt}
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
						<p>{message}</p>
						<span style={{ color: '#cccccc', fontSize: 'x-small' }}>{createdAt}</span>
					</div>
				</div>
			);
		}
	};

	render() {
		if (this.state.type === 'public') {
			const allMessage = this.state.allMessage;
			console.log("!_!public");
			return (
				<div id={style.chat_ul}>
					{allMessage ? this.makePublicChatList(allMessage) : ''}
				</div>
			);
		} else {
			const allMessage = this.state.message;
			return (
				<div id={style.chat_ul}>
					{allMessage ? this.makePublicChatList(allMessage) : ''}
				</div>
			);
		}
	}
}