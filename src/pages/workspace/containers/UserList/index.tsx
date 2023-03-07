import React, { useState, useMemo, useEffect } from 'react';
type FromChatProps = {
	socket: any;
	username: string;
	allUsers: Array<any>;
};

function UserList(props: FromChatProps) {
	const [socket, setSocket] = useState(props.socket);
	const [username, setUsername] = useState(props.username);
	const [allUsers, setAllUsers] = useState(props.allUsers);
	const [activeUserList, setActiveUserList] = useState('public');

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

	useState(() => {
		socket.emit('get public message', props.username);
	}, []);

	// 유리 리스트 클릭이벤트
	function userListClickHandler(e) {
		const beforeActiveTag = document.getElementsByClassName('list-group-item active')[0];
		if (beforeActiveTag) {
			const afterActiveTag = e.target;
			if (afterActiveTag.id !== activeUserList) {
				beforeActiveTag.classList.toggle('active');

				afterActiveTag.classList.toggle('active');
				setActiveUserList(afterActiveTag.id);
			}
		}
	}

	useEffect(() => {
		props.receiveActiveUser(activeUserList);
		console.log('active ', activeUserList);
		const from = username;
		const to = activeUserList;
		if (to === 'public') {
			// 전체 채팅 가져오기
			socket.emit('get public message', from);
		} else {
			// from 과 to의 채팅 가져오기
			socket.emit('get private message', from, to);
		}
	}, [activeUserList]);

	// 유저리스트 동적 생성
	function makeUserList(allUsers) {
		if (allUsers) {
			return allUsers
				.filter((user) => user.username !== username)
				.map((user) => (
					<li
						key={user.socketId}
						onClick={userListClickHandler}
						id={user.username}
						className="list-group-item"
					>
						{user.username}
					</li>
				));
		}
	}

	return (
		<div id="userlist_ui">
			<div className="panel panel-info">
				<ul className="list-group">
					<li
						onClick={userListClickHandler}
						id="public"
						className="list-group-item active"
					>
						전체
					</li>
					{allUsers ? makeUserList(allUsers) : ''}
				</ul>
			</div>
		</div>
	);
}

export default UserList;