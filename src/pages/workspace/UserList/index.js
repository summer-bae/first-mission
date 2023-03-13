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
function UserList(props) {
    const [socket, setSocket] = (0, react_1.useState)(props.socket);
    const [username, setUsername] = (0, react_1.useState)(props.username);
    const [allUsers, setAllUsers] = (0, react_1.useState)(props.allUsers);
    const [activeUserList, setActiveUserList] = (0, react_1.useState)('public');
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        props.receiveActiveUser(activeUserList);
        const from = username;
        const to = activeUserList;
        if (to === 'public') {
            // 전체 채팅 가져오기
            socket.emit('get public message', from);
        }
        else {
            // from 과 to의 채팅 가져오기
            if (from <= to) {
                socket.emit('join', from + to);
            }
            else {
                socket.emit('join', to + from);
            }
            socket.emit('get private message', to);
        }
    }, [activeUserList]);
    // 유저리스트 동적 생성
    function makeUserList(allUsers) {
        if (allUsers) {
            return allUsers
                .filter((user) => user.username !== username)
                .map((user) => (react_1.default.createElement("li", { key: user.socketId, onClick: userListClickHandler, id: user.username, className: "list-group-item" }, user.username)));
        }
    }
    return (react_1.default.createElement("div", { id: "userlist_ui" },
        react_1.default.createElement("div", { className: "panel panel-info" },
            react_1.default.createElement("ul", { className: "list-group" },
                react_1.default.createElement("li", { onClick: userListClickHandler, id: "public", className: "list-group-item active" }, "\uC804\uCCB4"),
                allUsers ? makeUserList(allUsers) : ''))));
}
exports.default = UserList;
