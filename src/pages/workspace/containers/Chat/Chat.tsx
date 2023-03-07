import React, { Component, useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Typing from '../Typing';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import Header from '../Header';
import UserList from '../UserList';
import ChatList from '../ChatList';
import axios from 'axios';
import style from './chat.css';

const socket = io.connect('', {
    path: '/socket.io',
    transports: ['websocket'],
});

function Chat(props) {
	
	const [ socket, setSocket ] = useState(props.socket);
	const [ username, setUsername ] = useState(props.username);
	const [ allUsers, setAllUsers ] = useState(props.allUsers);
	const [ allMessage, setAllMessage ] = useState(props.allMessage);
	const [ message, setMessage ] = useState(props.message);
	const [ activeUserList, setActiveUserList ] = useState(props.activeUserList);

    useEffect(() => {
        socket.on('public message', (obj) => {
            const temp = allMessage;
            temp.push(obj);

            setAllMessage(temp);

            this.lastLineFocus();
        });

        socket.on('private message', (obj) => {
            const temp = message;
            temp.push(obj);

            setMessage(temp);

            this.lastLineFocus();
        });

        this.lastLineFocus();
    }, []);

    useEffect(() => {
        this.lastLineFocus();
    }, [allMessage, message]);

    // 마지막 메시지 스크롤 포커스
    function lastLineFocus() {
        const lists = document.getElementsByClassName('chat_content');
        console.log(lists.length);
        if (lists.length > 0) {
            lists[lists.length - 1].scrollIntoView();
        }
    };



    function receiveActiveUser(activeUser) {
        setActiveUserList(activeUser);
    };

    return (
        <Container>
            <Row id={style.chat_wrapper}>
                <Col md="4" sm="4" xs="12" id="user_list_wrapper">
                    <UserList
                        allUsers={allUsers}
                        username={username}
                        socket={socket}
                        receiveActiveUser={receiveActiveUser}
                    />
                </Col>

                <Col md="8" sm="8" xs="12" id={style.chat_list_wrapper}>
                    <Row>
                        <ChatList
                            allMessage={allMessage}
                            username={username}
                            message={message}
                            type={activeUserList}
                        />
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

export default Chat;