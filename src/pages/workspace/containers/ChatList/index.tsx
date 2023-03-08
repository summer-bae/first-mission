import React, { useState, useEffect, useMemo } from 'react';
import style from './chatlist.module.css';

type ChatProps = {
	username: string;
	message: Array<any> | null;
	allMessage: Array<any> | null;
	type: string;
};

export default function ChatList(props: ChatProps) {
	const [allMessage, setAllMessage] = useState<Array<any> | null>(props.allMessage);
	const [user, setUser] = useState<string>(props.username);
	const [message, setMessage] = useState<Array<any> | null>(props.message);
	const [type, setType] = useState<string>(props.type);
	

	function distinctMsg(item) {
		if (item.username != user) {
			// 내가 보낸 것이 아니라면
			return (
				<div className="incoming_msg chat_content" key={item._id}>
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
				<div className="outgoing_msg chat_content" key={item._id}>
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

	function makePublicChatList(list) {
		if (list) {
			return list.map((item) => {
				return distinctMsg(item);
			});
		}
	}

	useEffect(() => {
		console.log('!!', props);
	}, []);

	useMemo(() => {
		if (props.allMessage) {
			setAllMessage(props.allMessage);
		}
	}, [props.allMessage]);
	
	useMemo(() => {
		if (props.message) {
			setMessage(props.message);
		}
	}, [props.message]);
	
	useMemo(() => {
		if (props.type) {
			setType(props.type);
		}
	}, [props.type]);
	
	useMemo(() => {
		console.log("USER CHANGE")
		if (props.username) {
			setUser(props.username);
		}
	}, [props.username]);

	if (type === 'public') {
		return <div id={style.chat_ul}>{allMessage ? makePublicChatList(allMessage) : ''}</div>;
	} else {
		return <div id={style.chat_ul}>{message ? makePublicChatList(message) : ''}</div>;
	}
}