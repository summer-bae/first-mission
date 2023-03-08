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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const reactstrap_1 = require("reactstrap");
function Typing(props) {
    const [socket, setSocket] = (0, react_1.useState)(props.socket);
    const [username, setUsername] = (0, react_1.useState)(props.username);
    const [allUsers, setAllUsers] = (0, react_1.useState)(props.allUsers);
    const [message, setMessage] = (0, react_1.useState)('');
    (0, react_1.useMemo)(() => {
        if (props.allUsers) {
            setAllUsers(props.allUsers);
        }
    }, [props.allUsers]);
    (0, react_1.useMemo)(() => {
        setSocket(props.socket);
    }, [props.socket]);
    (0, react_1.useMemo)(() => {
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
            }
            else {
                // 귓속말 전송
                socket.emit('private send message', from, to, msg);
            }
            setMessage('');
        }
        else {
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
    return (react_1.default.createElement(reactstrap_1.Col, null,
        react_1.default.createElement(reactstrap_1.InputGroup, null,
            react_1.default.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, allUsers),
            react_1.default.createElement(reactstrap_1.Input, { placeholder: "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694", onChange: messageChangeHandler, value: message, onKeyDown: keyPressHandler }),
            react_1.default.createElement(reactstrap_1.Button, { onClick: massageSendHandler }, "\uC804\uC1A1"))));
}
exports.default = Typing;
