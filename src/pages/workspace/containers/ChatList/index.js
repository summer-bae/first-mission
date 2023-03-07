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
const chatlist_css_1 = __importDefault(require("./chatlist.css"));
function ChatList(props) {
    const [allMessage, setAllMessage] = (0, react_1.useState)(props.allMessage);
    const [user, setUser] = (0, react_1.useState)(props.username);
    const [message, setMessage] = (0, react_1.useState)(props.message);
    const [type, setType] = (0, react_1.useState)(props.type);
    function distinctMsg(item) {
        const { _id, username, message, createdAt } = item;
        if (item.username != user) {
            // 내가 보낸 것이 아니라면
            return (react_1.default.createElement("div", { className: "incoming_msg chat_content", key: item._id },
                react_1.default.createElement("div", { className: chatlist_css_1.default.received_msg },
                    react_1.default.createElement("div", { className: chatlist_css_1.default.received_withd_msg },
                        react_1.default.createElement("strong", null, item.username),
                        react_1.default.createElement("p", null, item.message),
                        react_1.default.createElement("span", { style: { color: '#cccccc', fontSize: 'x-small' } }, item.createdAt)))));
        }
        else {
            // 내가 보낸 것이라면
            return (react_1.default.createElement("div", { className: "outgoing_msg chat_content", key: _id },
                react_1.default.createElement("div", { className: chatlist_css_1.default.sent_msg },
                    react_1.default.createElement("p", null, item.message),
                    react_1.default.createElement("span", { style: { color: '#cccccc', fontSize: 'x-small' } }, item.createdAt))));
        }
    }
    function makePublicChatList(list) {
        if (list) {
            return list.map((item) => {
                return distinctMsg(item);
            });
        }
    }
    (0, react_1.useEffect)(() => {
        console.log('!!', props);
    }, []);
    (0, react_1.useMemo)(() => {
        if (props.allMessage) {
            setAllMessage(props.allMessage);
        }
    }, [props.allMessage]);
    (0, react_1.useMemo)(() => {
        if (props.message) {
            setMessage(props.message);
        }
    }, [props.message]);
    (0, react_1.useMemo)(() => {
        if (props.type) {
            setType(props.type);
        }
    }, [props.type]);
    (0, react_1.useMemo)(() => {
        console.log("USER CHANGE");
        if (props.username) {
            setUser(props.username);
        }
    }, [props.username]);
    if (type === 'public') {
        return react_1.default.createElement("div", { id: chatlist_css_1.default.chat_ul }, allMessage ? makePublicChatList(allMessage) : '');
    }
    else {
        return react_1.default.createElement("div", { id: chatlist_css_1.default.chat_ul }, message ? makePublicChatList(message) : '');
    }
}
exports.default = ChatList;
