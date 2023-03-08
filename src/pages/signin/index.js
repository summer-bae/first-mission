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
const axios_1 = __importDefault(require("axios"));
const reactstrap_1 = require("reactstrap");
const DefaultUserInfoInputGroup_1 = __importDefault(require("../../components/DefaultUserInfoInputGroup"));
const CenterLayout_1 = __importDefault(require("../../components/CenterLayout"));
const AccountButtonGroup_1 = __importDefault(require("../../components/AccountButtonGroup"));
const style_module_scss_1 = __importDefault(require("./style.module.scss"));
function getErrorMsg(errCode) {
    let errorMsg;
    switch (errCode) {
        case 400:
            errorMsg = '잘못된 요청입니다.';
            break;
        case 420:
            errorMsg = '잘못된 아이디나 패스워드입니다.';
            break;
        default:
            errorMsg = '잠시 후 다시 시도해주시기랍니다.';
            break;
    }
    return errorMsg;
}
function SignIn() {
    const [id, setId] = (0, react_1.useState)('');
    const [pw, setPw] = (0, react_1.useState)('');
    const [errorMsg, setErrorMsg] = (0, react_1.useState)('');
    function onChangeId(e) {
        setId(e.currentTarget.value);
    }
    function onChangePw(e) {
        setPw(e.currentTarget.value);
    }
    function signIn() {
        axios_1.default
            .post('/api/account/signin', { id, pw })
            .then(({ data }) => {
            window.location.href = '/';
        })
            .catch((err) => {
            setErrorMsg(getErrorMsg(err.response.status));
        });
    }
    return (react_1.default.createElement(CenterLayout_1.default, null,
        react_1.default.createElement("div", { className: style_module_scss_1.default.Signin },
            react_1.default.createElement(DefaultUserInfoInputGroup_1.default, { onChangeId: onChangeId, onChangePw: onChangePw, id: id, pw: pw }),
            errorMsg && react_1.default.createElement(reactstrap_1.FormText, null, errorMsg),
            react_1.default.createElement(AccountButtonGroup_1.default, { buttonLabel: "\uB85C\uADF8\uC778", onClickButton: signIn, linkLabel: "\uD68C\uC6D0\uAC00\uC785", linkTo: "/signup" }))));
}
exports.default = SignIn;
