"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const reactstrap_1 = require("reactstrap");
const Typing_1 = __importDefault(require("../Typing"));
const UserList_1 = __importDefault(require("../UserList"));
const ChatList_1 = __importDefault(require("../ChatList"));
const axios_1 = __importDefault(require("axios"));
const chat_module_css_1 = __importDefault(require("./chat.module.css"));
// 전체 채팅 다시 불러오는 거 비효율
function Chat(props) {
    const socket = props.socket;
    const [username, setUsername] = (0, react_1.useState)(props.username);
    const [allUsers, setAllUsers] = (0, react_1.useState)(props.allUsers);
    const [allMessage, setAllMessage] = (0, react_1.useState)(props.allMessage);
    const [message, setMessage] = (0, react_1.useState)(props.message);
    const [activeUserList, setActiveUserList] = (0, react_1.useState)('public');
    // 마지막 메시지 스크롤 포커스
    function lastLineFocus() {
        const lists = document.getElementsByClassName('chat_content');
        if (lists.length > 0) {
            lists[lists.length - 1].scrollIntoView();
        }
    }
    (0, react_1.useEffect)(() => {
        axios_1.default.get('/api/account/id').then(({ data }) => {
            setUsername(data);
            socket.on('success public room', () => {
                socket.emit('get all users');
            });
            socket.emit('get public message', data);
        });
        lastLineFocus();
    }, []);
    (0, react_1.useEffect)(() => {
        socket.on('public all message', (obj) => {
            setAllMessage(obj);
        });
        lastLineFocus();
    }, [allMessage]);
    (0, react_1.useEffect)(() => {
        socket.on('private get message', (obj) => {
            setMessage(obj);
        });
        lastLineFocus();
    }, [message]);
    (0, react_1.useEffect)(() => {
        socket.on('success get users', (allUsers) => {
            setAllUsers(allUsers);
        });
    }, [allUsers]);
    function receiveActiveUser(activeUser) {
        setActiveUserList(activeUser);
    }
    return (react_1.default.createElement(reactstrap_1.Container, null,
        react_1.default.createElement(reactstrap_1.Row, { id: chat_module_css_1.default.chat_wrapper },
            react_1.default.createElement(reactstrap_1.Col, { md: "4", sm: "4", xs: "12", id: "user_list_wrapper" },
                react_1.default.createElement(UserList_1.default, { allUsers: allUsers, username: username, socket: socket, receiveActiveUser: receiveActiveUser })),
            react_1.default.createElement(reactstrap_1.Col, { md: "8", sm: "8", xs: "12", id: chat_module_css_1.default.chat_list_wrapper },
                react_1.default.createElement(reactstrap_1.Row, null,
                    react_1.default.createElement(ChatList_1.default, { allMessage: allMessage, username: username, message: message, type: activeUserList })),
                react_1.default.createElement(reactstrap_1.Row, null,
                    react_1.default.createElement(Typing_1.default, { socket: socket, activeUserList: activeUserList, username: username }))))));
}
exports.default = Chat;
