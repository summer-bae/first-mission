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
const axios_1 = __importDefault(require("axios"));
const style_module_scss_1 = __importDefault(require("./style.module.scss"));
const io = __importStar(require("socket.io-client"));
const Chat_1 = __importDefault(require("../Chat/Chat"));
const newSocket = io.connect('', {
    path: '/socket.io',
    transports: ['websocket'],
});
function Header() {
    const [socket, setSocket] = (0, react_1.useState)(newSocket);
    const [username, setUsername] = (0, react_1.useState)('');
    const [allUsers, setAllUsers] = (0, react_1.useState)(null);
    const [allMessage, setAllMessage] = (0, react_1.useState)(null);
    const [message, setMessage] = (0, react_1.useState)(null);
    console.log(allUsers, allMessage);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('/api/account/id').then(({ data }) => {
            setUsername(data);
            socket.emit('enter public room', data);
            socket.on('success public room', () => {
                socket.emit('get all users');
            });
            socket.on('success get users', (allUsers) => {
                setAllUsers(allUsers);
            });
            socket.on('public all message', (allMessage) => {
                setAllMessage(allMessage);
            });
            socket.on('private get message', (message) => {
                setMessage(message);
            });
        });
    }, []);
    function signOut() {
        window.location.href = '/api/account/signout';
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: style_module_scss_1.default.Header },
            react_1.default.createElement(reactstrap_1.UncontrolledDropdown, null,
                react_1.default.createElement(reactstrap_1.DropdownToggle, { caret: true, tag: "a", className: style_module_scss_1.default.Header__dropdown }, username),
                react_1.default.createElement(reactstrap_1.DropdownMenu, { right: true },
                    react_1.default.createElement(reactstrap_1.DropdownItem, { onClick: signOut }, "\uB85C\uADF8\uC544\uC6C3")))),
        react_1.default.createElement(Chat_1.default, { socket: socket, username: username, allUsers: allUsers, allMessage: allMessage, message: message }),
        react_1.default.createElement("hr", null)));
}
exports.default = Header;
